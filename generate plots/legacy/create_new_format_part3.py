import json
from del3 import details


new_file = open('map_plots_center.json', 'r')
existing = json.loads(new_file.read())
new_file.close()

for index, plots_details in enumerate(details):
    existing["row"+str(index+1)].update(plots_details)

new_file = open('map_plots_center.json', 'w')
new_file.write(json.dumps(existing))
new_file.close()
