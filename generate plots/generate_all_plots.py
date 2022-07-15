import json
from numbers import Number
from calc_coords import *

# graveyard variables
northwest_wall_angle = 216.5  # degrees from true north
# 'orientation' means direction u r facing when looking @ gravestone


# returns distance in metres
def format_distance(distance):
    if type(distance) is list:
        if len(distance) == 1:
            return feet_inch_to_m(
                distance[0])
        elif len(distance) == 2:
            return feet_inch_to_m(
                distance[0], distance[1])
        else:
            raise ValueError(
                "should only be feet or feet and inches provided")

    elif isinstance(distance, Number):
        return distance
    elif type(distance) is str:
        return eval(distance)
    else:
        raise TypeError(
            "height has to be number or list, not", type(distance))


def format_angle(angle, **kwargs):
    # if kwargs:
    #     print(kwargs)

    if isinstance(angle, Number):
        return angle
    elif type(angle) is str:
        return eval(angle, None, kwargs)
    else:
        raise TypeError(
            "angle has to be eval expression (string) or a number, instead", angle, "is", type(angle))


# converting distances from ft & in to metres & angles to a number
def format_numbers(plot_data: dict):
    for row in plot_data.keys():
        if "width" in plot_data[row].keys():
            plot_data[row]["width"] = format_distance(
                plot_data[row]["width"])

        # if "orientation" in plot_data[row].keys():
        #     plot_data[row]["orientation"] = format_angle(
        #         plot_data[row]["orientation"])

        for index, plot in enumerate(plot_data[row]["plots"]):
            plot_data[row]["plots"][index]["height"] = format_distance(
                plot["height"])
            if "actual width" in plot.keys():
                plot_data[row]["plots"][index]["actual width"] = format_distance(
                    plot["actual width"])
            if "shift" in plot.keys():
                plot_data[row]["plots"][index]["shift"] = format_distance(
                    plot["shift"])

    return plot_data


# based on data in json file, generate all plots
def generate_all_plots(json_filename: str):
    plot_data_file = open(json_filename, 'r')
    plot_data = format_numbers(json.loads(plot_data_file.read()))
    last_orientation = None

    for row_id in plot_data.keys():
        row = plot_data[row_id]
        if "orientation" in row.keys():
            if not last_orientation:
                this_orientation = format_angle(
                    row["orientation"])
            else:
                this_orientation = format_angle(
                    row["orientation"], last_orientation=last_orientation)

        if "anchor" in row.keys():
            top_left = get_plot_coords(row["anchor"]["start"]["plotNumber"])[
                row["anchor"]["start"]["corner"]]
            for displacement in row["anchor"]["displacements"]:
                top_left = add_distance_2(
                    top_left, format_distance(displacement["distance"]), format_angle(displacement["bearing"], this_orientation=this_orientation, last_orientation=last_orientation))
        else:
            top_left = row["top left"]

        calc_plot_rows(row["width"], row["plots"],
                       top_left, this_orientation)
        last_orientation = this_orientation

    plot_data_file.close()


generate_all_plots('./plots data (for generation)/map_plots_top_left.json')
generate_all_plots('./plots data (for generation)/map_plots_top_right.json')
generate_all_plots('./plots data (for generation)/map_plots_center.json')
generate_all_plots('./plots data (for generation)/map_plots_bottom.json')


## ANOMALIES ##
##### *** TOP LEFT QUARTER *** #####
plot_data_file = open(
    './plots data (for generation)/map_plots_center.json', 'r')
plot_data = format_numbers(json.loads(plot_data_file.read()))

# plotNumber 1 (non-rectangle)
row_orientation = northwest_wall_angle+.125-180
calc_plot(feet_inch_to_m(8), feet_inch_to_m(8, 4), add_distance_2(get_plot_coords(
    2)[0], feet_inch_to_m(8, 4), row_orientation), row_orientation, 1, "Whisker")

plot_data_file.close()


##### *** CENTER *** #####
plot_data_file = open(
    './plots data (for generation)/map_plots_center.json', 'r')
plot_data = format_numbers(json.loads(plot_data_file.read()))

# 7 - just graves unknown different shape
row_orientation = eval(plot_data["row7"]["orientation"])

update_vertex(add_distance_2(get_plot_coords(163)[0], feet_inch_to_m(
    1.5), row_orientation+90+45), 163, 0)
update_vertex(add_distance_2(get_plot_coords(163)[2], feet_inch_to_m(
    -1.5), row_orientation+90+45), 163, 2)
update_vertex(add_distance_2(get_plot_coords(163)[3], feet_inch_to_m(
    1.5), row_orientation), 163, 4)

# 8 - Olney Tiles make into a triangle
row_orientation = eval(plot_data["row8"]["orientation"])
corner_2_offset = 6.36842  # in feet
update_vertex(add_distance_2(get_plot_coords(167)[3], feet_inch_to_m(
    corner_2_offset), row_orientation+90), 167, 3)
update_vertex(add_distance_2(get_plot_coords(167)[2], feet_inch_to_m(
    9-corner_2_offset, 6), row_orientation-90), 167, 2)

plot_data_file.close()
