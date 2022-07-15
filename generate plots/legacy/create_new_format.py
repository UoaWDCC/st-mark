import json

og_format_file = open('map_plots_bottom_v1.json', 'r')
og_content = json.loads(og_format_file.read())

new_dict = {}

for key in og_content.keys():
    plots = og_content[key]
    name = key.split('_')[0]
    new_dict[name] = {'plots': plots}

new_file = open('map_plots_bottom.json', 'w')
new_file.write(json.dumps(new_dict))

new_file.close()
og_format_file.close()
