#!/usr/bin/env python3
import argparse, os, shutil, ast, re
from mimetypes import guess_type
from http.server import SimpleHTTPRequestHandler
from socketserver import ThreadingTCPServer

# Constants
class HELP:
	DESC = "Zero-build Jekyll-like server, for debugging purposes only"
	ADDR = "Launches local DNS server and registers specified hostname network-wide"
	PORT = "Specifies server port (default = 8000)"
	LOC  = "Binds server to localhost (ignoring other connections)"
	SRC  = "Specifies source files folder. If include or template files are inside, they are ignored (default = \".\")"
	LOUT = "Specifies layouts folder (default = \"{{source}}/_layouts\")"
	INCL = "Specifies includes folder (default = \"{{source}}/_includes\")"
	CACH = "Caches builded pages into specified folder. After shutdown cache is cleaned"
	BLD  = "Builds site into specified folder instead of serving"

class HTTPServer:
	class RequestHandler(SimpleHTTPRequestHandler):
		def do_GET(self):
			code, mime, data = self.server.callback(self.path)
			self.send_response(code or 500)
			self.send_header("Cache-Control", "no-cache, no-store")
			if mime != None:
				self.send_header("Content-Type", mime)
			self.end_headers()
			if data != None:
				self.wfile.write(data)
		
		def do_POST(self):
			self.send_response(403)
			self.end_headers()
	
	@staticmethod
	def def_callback(path):
		path = path.split("?")[0].split("#")[0]
		path = os.path.abspath(path.lstrip("/"))

		if os.path.isdir(path):
			path = os.path.join(path, "index.html")
		
		try:
			with open(path, "rb") as file:
				content = file.read()
		except FileNotFoundError: return (404, None, None)
		except PermissionError:   return (403, None, None)
		except:	                  return (500, None, None)
		return (200, guess_type(os.path.basename(path))[0], content)

	TCP = None

	def __init__(self, port = 80, local = False, callback = def_callback):
		addr = ("127.0.0.1" if local else "", port)
		ThreadingTCPServer.allow_reuse_address = True

		try: self.TCP = ThreadingTCPServer(addr, self.RequestHandler)
		except OSError: raise Exception("Address in use")
		
		self.TCP.callback = callback
	
	def run(self):
		try: self.TCP.serve_forever()
		except KeyboardInterrupt: return

	def __del__(self):
		if self.TCP is not None:
			self.TCP.shutdown()

class DNSServer():
	def __init__(self):
		pass

	def __del__(self):
		pass

class PageBuilder():
	class InvalidTag(Exception):
			def __init__(self, match, reason):
				self.tag = match.group()
				self.at = match.start()
				self.reason = reason
			def __str__(self):
				return f"Invalid tag \"{self.tag}\" at {self.at}: {self.reason}"
	
	_YAML_MAP = {
		"null": None,
		"true": True,
		"false": False
	}

	layouts = None
	includes = None
	cache = None
	built = False

	def __init__(self, layouts = "./_layouts", includes = "./_includes", cache = "./_site"):
		self.layouts = layouts
		self.includes = includes
		self.cache = cache

		if cache is not None:
			os.mkdir(cache)
	
	def parse(self, content: bytes):
		if content[:3] != b"---":
			return content

		end = content.find(b"\n---", 3)
		if end == -1: end = content.find("\n\n", 3)
		if end == -1: return content

		head = content[3:end].decode()
		content = content[end + 4:].strip()

		data = {}
		for line in head.split("\n"):
			try: key, val = line.split(": ", 1)
			except ValueError: continue

			key = key.strip()
			val = val.strip()
			try: data[key] = self._YAML_MAP[val]
			except KeyError:
				try: data[key] = ast.literal_eval(val)
				except: data[key] = val
		
		if "layout" in data.keys() and isinstance(data["layout"], str):
			try:
				lay_path = None
				for file in os.listdir(self.layouts):
					if os.path.splitext(file)[0] == data["layout"]:
						lay_path = os.path.join(self.layouts, file)
						break
				if lay_path is None:
					raise FileNotFoundError(data["layout"] + "*")
				
				with open(lay_path, "rb") as lay:
					layout = lay.read()
					layout = re.sub(rb"\{\{\s*content\s*\}\}", b"{{content}}", layout)
					layout = layout.replace(b"{{content}}", content)
					content = layout
			except OSError as e: print(e)

		pos = 0
		finder = re.compile(rb"\{\{.*?\}\}|{%.*?%}")
		tag = finder.search(content, pos)

		while tag is not None:
			text = tag.group()[2:-2].strip()

			try:
				if tag.group().startswith(b"{{"):
					if not text in data.keys(): raise self.InvalidTag(tag, "Unknown variable")
					content = content[:tag.start()] + data[text] + content[tag.end():]
					pos = tag.start() + len(data[text])

				else:
					parsed = text.decode().split()
					match parsed[0]:
						case b"include":
							if len(parsed) != 2: raise self.InvalidTag(tag, "Wrong argument number")
							
							inc_path = os.path.join(self.includes, parsed[1])
							if not os.path.exists(inc_path):
								inc_path = None
								for file in os.listdir(self.includes):
									if os.path.splitext(file)[0] == data["layout"]:
										lay_path = os.path.join(self.layouts, file)
										break
								if lay_path is None:
									raise FileNotFoundError(data["layout"] + "*")
							try:
								with open(inc_path, "rb") as inc:
									include = self.parse(inc.read())
									content = content[:tag.start()] + include + content[tag.end():]
									pos = tag.start() + len(include)
							except OSError as e: print(e)
						
						case _: raise self.InvalidTag(tag, "Unknown tag")
			except (self.InvalidTag, OSError) as e:
				print(e)
				pos = tag.end()
			
			tag = finder.search(content, pos)
		
		return content

	def build(self, output = "./_site"):
		skip_list = [self.layouts, self.includes, self.cache, output]

		if os.path.exists(output):
			shutil.rmtree(output)
		os.makedirs(output)

		for root, dirs, files in os.walk("."):
			skip = False
			for path in skip_list:
				if os.path.samefile(root, path):
					skip = True
					break
			if skip: continue

			for file in files:
				inp = os.path.join(root, file)
				out = os.path.join(output, file)
				outdir = os.path.dirname(out)

				os.makedirs(outdir, exist_ok = True)
				with open(out, "wb") as file:
					file.write(self.parse(inp))
		
		built = True

	def __del__(self):
		if self.cache is not None and not self.built:
			os.rmdir(self.cache)

def main():
	# Parse arguments
	parser = argparse.ArgumentParser(description = HELP.DESC)
	parser.add_argument("-a", "--addr",		metavar = "<address>",			help = HELP.ADDR)
	parser.add_argument("-p", "--port",		type = int, metavar = "<port>", help = HELP.PORT)
	parser.add_argument("-r", "--local",	action = 'store_true',			help = HELP.LOC)
	parser.add_argument("-s", "--source",	metavar = "<dir>",				help = HELP.SRC)
	parser.add_argument("-l", "--layouts",	metavar = "<dir>",				help = HELP.LOUT)
	parser.add_argument("-i", "--includes",	metavar = "<dir>",				help = HELP.INCL)
	parser.add_argument("-c", "--cache",	metavar = "<dir>",				help = HELP.CACH)
	parser.add_argument("-b", "--build",	metavar = "<dir>",				help = HELP.BLD)
	args = parser.parse_args()

	if args.source is not None:
		os.chdir(args.source)

	Parser = PageBuilder(
		layouts = args.layouts or "./_layouts",
		includes = args.includes or "./_includes",
		cache = None if (args.cache is None) else args.cache
	)

	if args.build is not None:
		Parser.build(args.build)
		return

	def callback(path):
		path = path.split("?")[0].split("#")[0]
		path = os.path.abspath(path.lstrip("/"))

		if os.path.isdir(path):
			path = os.path.join(path, "index.html")
			
		try:
			with open(path, "rb") as file:
				content = file.read()
		except FileNotFoundError: return (404, None, None)
		except PermissionError: return (403, None, None)
		except: return (500, None, None)

		mime = guess_type(os.path.basename(path))[0]
		return (200, mime, Parser.parse(content))
	
	HTTP = HTTPServer(args.port or 8000, args.local, callback)
	HTTP.run()

if __name__ == "__main__":
	main()
