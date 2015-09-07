module Jekyll
  module ConsoleCommandsHelper
    # Clean out the help text from the console commands
    def process_help(input)
      # Remove symfony/console-specific tags
      replacements = [ ['<comment>', '`'], ['</comment>', '`'], ['<info>', ''], ['</info>', ''] ]
      replacements.each {|replacement| input.gsub!(replacement[0], replacement[1])}

      # Turn URLs into links
      input.gsub!(/(https?:\/\/\S+)/, '[\1](\1)')

      # Return the result
      input
    end

    # Build the option string
    def option_to_html(option)
      name     = option['name']
      shortcut = ""
      value   = ""

      if option['accept_value'] == true
        value = "=<em>&lt;value&gt;</em>"
      end

      str = "<code>#{name}</code>#{value}"

      if !option['shortcut'].empty?
         shortcut = option['shortcut']
         str = "#{str}, <code>#{shortcut}</code>#{value}"
      end

      str
    end
  end
end

Liquid::Template.register_filter(Jekyll::ConsoleCommandsHelper)