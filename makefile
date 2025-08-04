blog:
	@filename=`TZ='America/Los_Angeles' date +"%m%d%y"`; \
	echo "---" > content/$$filename.mdx; \
	echo "title: $$filename" >> content/$$filename.mdx; \
	echo "publishedAt: $(shell TZ='America/Los_Angeles' date +"%Y-%m-%dT%H:%M:%S%z")" >> content/$$filename.mdx; \
	echo "---" >> content/$$filename.mdx;

push:
	@git add .
	@git commit -m "`TZ='America/Los_Angeles' date +"%m%d%y"`"
	@git push