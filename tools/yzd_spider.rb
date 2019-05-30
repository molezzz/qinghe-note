require 'kimurai'
require 'open-uri'
require 'faraday'
require 'json'
require 'nokogiri'

class YZDSpider < Kimurai::Base
  @name = "fangji_spider"
  # @engine = :selenium_chrome
  @engine = :mechanize
  @start_urls = ["http://www.yzd2017.com"]
  @config = {
    user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36",
    before_request: { delay: 1..3 }
  }
  @data = []

  def parse(response, url:, data: {})
    # link = response.css('tr.text > td center > a').last[:href]
    # page = /pageid=(\d+)?/.match(link)
    # total_page = 0
    # base_url = nil
    # if page && page[1]
    #   total_page = page[1].to_i
    #   base_url = link.gsub(/pageid=(\d+)/, 'pageid=')
    # end

    # (1..total_page).each do  |id|
    #   request_to :parse_list, url: absolute_url("#{base_url}#{id}", base: url)
    # end

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

end

items = []
item_hash = {}
(0...25).each do |page|
  response = Faraday.get "http://www.yzd2017.com/Lib/GetCustomerDataByDSId?DataStructureId=4abd2bb2-4b7f-4559-851d-9c8e37e0a174&firstLetter=&BaseTypeId=e70b4f1a-2a99-49a4-bfa3-3d1ff159992a&pageIndex=#{page}"

  data = JSON.parse response.body
  puts data
  data['re'].each do |re|
    r = Faraday.get "http://www.yzd2017.com/Main/Lib/Details/#{re['id']}"
    if r.success?
      doc = Nokogiri::HTML r.body
      table = doc.css('.basic-info .value').collect {|dom| dom.text }
      item = [table[0].strip, table[1].strip, table[2].strip.upcase]
      items << item
      item_hash[item[0]] = item[2]
      puts item
    end
    sleep 0.5
  end
  # YZDSpider.crawl!
end

File.open('yzd.json', 'w') {|fp| fp.write JSON.pretty_generate(item_hash) }