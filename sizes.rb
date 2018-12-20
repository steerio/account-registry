#!/usr/bin/env ruby

require 'json'

for file in Dir.glob('build/contracts/*.json').sort do
  src = JSON.parse File.read(file)
  s = src['bytecode'].size
  next if s <= 2
  puts "#{src['contractName']}: #{(s-2)/2}"
end
