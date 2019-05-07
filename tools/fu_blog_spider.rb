require 'kimurai'
require 'open-uri'

# 傅老师博客抓取工具
class FuBlogSpider < Kimurai::Base
  @name = "fu_blog_spider"
  @engine = :mechanize
  # @engine = :mechanize
  @start_urls = ["http://blog.sina.com.cn"]  #http://blog.sina.com.cn/u/1130777737
  @config = {
    user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36",
    before_request: { delay: 1..2 }
  }
  @data = []

  def parse(response, url:, data: {})
    total_page = 23
    base_url = 'http://blog.sina.com.cn/s/article_sort_1130777737_10001_'
    
    (13..total_page).each do  |id|
      request_to :parse_list, url: "#{base_url}#{id}.html"
    end

  end

  def parse_list(response, url:, data: {})
    links = response.css('.SG_more a').collect do |a|
      a[:href]
    end

    links.uniq.compact.each do |link|
      request_to :parse_page, url: link
    end
  end

  def parse_page(response, url:,data: {})
    response = browser.current_response
    item = {
      attrs: {}
    }
    content = response.css('.articalContent').text()
    title = response.css('.articalTitle h2').first.text()
    time = response.css('.articalTitle .time').first.text().gsub(/[\(\)]/,'').split(/\s/).first

    p title
    p time

    open("fu_blogs/#{title}_#{time}.txt".gsub(/\s/,'_'),'w') do |f|
      f << content
    end
    # save_to 'medicine.json', item, format: :json, append: true
  end

  
end

FuBlogSpider.crawl!