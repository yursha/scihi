import json
from glob import glob
from html.parser import HTMLParser

events = {}
mode = None
current_year = None
current_title = None

class MyHTMLParser(HTMLParser):
    def handle_starttag(self, tag, attrs):
      global mode, events, current_year, current_title
      if tag == 'h1':
        mode = 'year'
      if tag == 'h2':
        mode = 'title'
      if tag == 'p':
        mode = 'description'

    def handle_endtag(self, tag):
      global mode, events, current_year, current_title
      if tag == 'h1' or tag == 'h2' or tag == 'p':
        mode = None

    def handle_data(self, data):
      global mode, events, current_year, current_title
      if mode == 'year':
        current_year = data
        events[current_year] = []
      elif mode == 'title':
        current_title = data
        if '(' in current_title:
          parts = current_title.split('(')
          authors = parts[1].strip(')')
          events[current_year].append({'title': parts[0], 'authors': authors, 'description': ''})
        else:
          events[current_year].append({'title': current_title, 'authors': '', 'description': ''})
      elif mode == 'description':
        if not events[current_year]:
          events[current_year].append({'title': 'catchall', 'authors': '', 'description': ''})
        last_event = events[current_year][-1]
        last_event['description'] += data

#files = glob("*.html")
#files.sort()
#for filename in files:
#  fd = open(filename, mode='r')
#  parser = MyHTMLParser()
#  parser.feed(fd.read())
#  fd.close()

fd = open('./7ContemporaryHistory.html', mode='r')
parser = MyHTMLParser()
parser.feed(fd.read())
fd.close()

print(json.dumps(events, sort_keys = True, indent = 4))
