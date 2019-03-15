require 'kimurai'
require 'open-uri'

class MedicineSpider < Kimurai::Base
  @name = "medicine_spider"
  @engine = :poltergeist_phantomjs #:selenium_firefox
  # @engine = :mechanize
  @start_urls = ["http://libproject.hkbu.edu.hk/was40/search?channelid=47953&lang=chs"]
  @config = {
    user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36",
    before_request: { delay: 1..2 }
  }
  @data = []

  def parse(response, url:, data: {})
    total_page = 105
    base_url = 'outline?channelid=47953&ispage=yes&trslc=50331861.1552550961.1'

    (1..total_page).each do  |id|
      request_to :parse_list, url: absolute_url("#{base_url}&page=#{id}", base: url)
    end

  end

  def parse_list(response, url:, data: {})
    links = response.css('tr.text5 script').collect do |script|
      m = /<a href=\"(?<link>.*?)\">/.match(script)
      # m2 = /detail\?rid=(.*?)&/.match(script)
      # if m
      #   if m2
      #     "#{m[:link]}&rid=#{m2[1]}&lang=chs"
      #   else
      #     m[:link]
      #   end
      # end
      m[:link] + '&lang=chs' if m
    end

    links.uniq.compact.each do |link|
      request_to :parse_page, url: absolute_url(link, base: url)
    end
  end

  def parse_page(response, url:,data: {})
    response = browser.current_response
    item = {
      attrs: {}
    }
    table = response.css('table[cellspacing=30] > tbody > tr > td.text')
    img = table.css('p[align=center] img').first
    if img && img[:src]
      item[:img] = absolute_url(img[:src], base: url)
      item[:key] = img[:src].split('/').last.gsub('.jpg','')
    end
    table.css('table[width=645] tr').each do |tr|
      contents = tr.css('td').children.collect {|n| 
        if n.name != 'script'
          n.text.strip.gsub(/[【】]/,'')
        else
          nil
        end
      }
      val = contents.reject { |c| c.nil? || c == ''}
      if val.length > 0
        if val[0] == '名称'
          item[:name] = val[1]
        elsif val[0] == '拼音'
          item[:pinyin] = val[1]
        elsif val[0] != '连结'
          item[:attrs][val[0]] = val[1]
        end
      end
    end

    open("medicine_images/#{item[:key]}_#{item[:pinyin]}.jpg",'wb') do |f|
      f << open(item[:img]).read
    end if item[:img]
    #p table
    puts item
    save_to 'medicine.json', item, format: :json, append: true
  end

  
end

MedicineSpider.crawl!