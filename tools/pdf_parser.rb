require 'rubygems'
require 'pdf-reader'
require 'json'


reader = PDF::Reader.new("shennong.pdf")
page_count = 0
current_block_key = nil
blocks = {}
lines = []

reader.pages.each do |page|
  page_count += 1
  next if page_count < 19 || page_count > 144
  lines += page.text.split(/\n/)
  # page.fonts
  # puts page.text
  # puts page.raw_content
end

block_lines = {}
current_line_title = nil

lines.each do |line|
  parts = /(?<sn>[一二三四五六七八九十]{1,})、(?<name>[\w\W]*)?/.match(line)
  
  if parts && parts['name'] && parts['name'] != ''
    blocks[current_block_key] = block_lines
    block_lines = {}
    current_line_title = nil
    current_block_key = parts['name']
  else
    # blocks[current_block_key] ||= []
    # blocks[current_block_key] << line if line && line != ''
    # puts line
    line_parts = /【(?<title>.*?)】(?<content>[\w\W]+)?/.match(line)
    puts line_parts['title'] if line_parts
    if line_parts
      current_line_title = line_parts['title']
      block_lines[current_line_title] = line_parts['content']
    else
      if !current_line_title
        current_line_title = '其他'
      end
      next if line =~ /倪注神农本草经/ 
      block_lines[current_line_title] ||= ''
      block_lines[current_line_title] += line
    end 
  end

end


puts JSON.pretty_generate blocks