module Jekyll
  module ConsoleCommandsHelper
    def process_help(input)
      # Remove symfony/console-specific tags
      replacements = [ ['<comment>', '`'], ['</comment>', '`'], ['<info>', ''], ['</info>', ''] ]
      replacements.each {|replacement| input.gsub!(replacement[0], replacement[1])}

      # Turn URLs into links
      input.gsub!(/(https?:\/\/\S+)/, '[\1](\1)')

      # Return the result
      input
    end
  end
end

Liquid::Template.register_filter(Jekyll::ConsoleCommandsHelper)