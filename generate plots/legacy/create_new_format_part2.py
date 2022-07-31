import json

og_format_file = open('simplify_generation.txt', 'r')
og_content = og_format_file.read()

new_file = open('map_plots_center.json', 'r')
blank_dict = json.loads(new_file.read())

blocks = og_content.split('# ')[1:]
print(blocks)
for block in blocks:
    row_num = block[:1]
    print(block)
    dict = json.loads('{'+block[1:].strip()+'}')
    print(dict)
    blank_dict['row'+row_num].update(dict)


print(blank_dict)
new_file.close()
og_format_file.close()
