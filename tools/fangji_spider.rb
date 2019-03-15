require 'kimurai'
require 'open-uri'

class FangJiSpider < Kimurai::Base
  @name = "fangji_spider"
  # @engine = :selenium_chrome
  @engine = :mechanize
  @start_urls = ["http://lib-nt2.hkbu.edu.hk/database/cmed/cmfid/uat/index.asp?lang=chs"]
  @config = {
    user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36",
    before_request: { delay: 1..3 }
  }
  @data = []

  def parse(response, url:, data: {})
    link = response.css('tr.text > td center > a').last[:href]
    page = /pageid=(\d+)?/.match(link)
    total_page = 0
    base_url = nil
    if page && page[1]
      total_page = page[1].to_i
      base_url = link.gsub(/pageid=(\d+)/, 'pageid=')
    end

    (1..total_page).each do  |id|
      request_to :parse_list, url: absolute_url("#{base_url}#{id}", base: url)
    end

    # if next_page = response.at_xpath("//a[@class='next_page']")
    #   request_to :parse, url: absolute_url(next_page[:href], base: url)
    # end
  end

  def parse_list(response, url:, data: {})
    links = response.css('table#main_content_tb font[color=blue] > a')
    links.each do |link|
      request_to :parse_page, url: absolute_url(link[:href], base: url)
    end
  end

  def parse_page(response, url:,data: {})
    item = {
      formula_table: [],
      details: {}
    }
    table = response.css('td.tbl_main2')
    # 处理方解表
    table.css('table#formula_table > tbody tr').each do |tr|
      tds = tr.css('td')
      item[:formula_table] << {
        position: tds[0].text,
        name: tds[1].text,
        effect: tds[2].text,
        remark: (tds[3].text)
      }
    end
    # 处理方解图
    item[:img] = absolute_url(table.css('img#myImg').first[:src], base: url)
    # 处理永久链接
    item[:link] = table.css("table[bgcolor='#f5f6ce'] p.text a").first.text.gsub(/\s/,'')
    # 处理药方id
    id = /id=(\w+)?/.match(item[:link])
    item[:key] = id[1] if id

    open("fangji_images/#{item[:key]}.jpg",'wb') do |f|
      f << open(item[:img]).read
    end 

    table.css("table[cellpadding=2][style='margin: 0px; text-align: justify; text-justify: inter-word;'] > tr").each do |tr|
      tds = tr.css('td')
      key = tds[0].text.gsub(/【|】/,'').strip
      item[:details][key] = tds[1].text.strip
    end
    puts item
    save_to 'fangji.json', item, format: :json, append: true
  end

  # def parse_repo_page(response, url:, data: {})
  #   item = {}

  #   item[:owner] = response.xpath("//h1//a[@rel='author']").text
  #   item[:repo_name] = response.xpath("//h1/strong[@itemprop='name']/a").text
  #   item[:repo_url] = url
  #   item[:description] = response.xpath("//span[@itemprop='about']").text.squish
  #   item[:tags] = response.xpath("//div[@id='topics-list-container']/div/a").map { |a| a.text.squish }
  #   item[:watch_count] = response.xpath("//ul[@class='pagehead-actions']/li[contains(., 'Watch')]/a[2]").text.squish
  #   item[:star_count] = response.xpath("//ul[@class='pagehead-actions']/li[contains(., 'Star')]/a[2]").text.squish
  #   item[:fork_count] = response.xpath("//ul[@class='pagehead-actions']/li[contains(., 'Fork')]/a[2]").text.squish
  #   item[:last_commit] = response.xpath("//span[@itemprop='dateModified']/*").text

  #   save_to "results.json", item, format: :pretty_json
  # end
end

FangJiSpider.crawl!