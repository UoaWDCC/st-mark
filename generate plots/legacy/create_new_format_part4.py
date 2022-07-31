import json

og_format_file = open('map_plots_top_right.json', 'r')
og_content = json.loads(og_format_file.read())
og_format_file.close()

new_dict = {}

for key in og_content.keys():
    plots = og_content[key]["plots"]
    name = key+"_plots"
    new_dict[name] = plots

new_file = open('map_plots_top_right_v1.json', 'w')
new_file.write(json.dumps(new_dict))

new_file.close()
