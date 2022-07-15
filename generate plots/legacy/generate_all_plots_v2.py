import json
from numbers import Number
from calc_coords import *
# from plot_data_from_map_v2 import *

# graveyard variables
northwest_wall_angle = 216.5  # degrees from true north


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


def format_angle(angle):
    if isinstance(angle, Number):
        return angle
    elif type(angle) is str:
        return eval(angle)
    else:
        raise TypeError(
            "angle has to be eval expression (string) or a number, instead", angle, "is", type(angle))


# converting distances from ft & in to metres & angles to a number
def format_numbers(plot_data):
    for row in plot_data.keys():
        for index, plot in enumerate(plot_data[row]):
            plot_data[row][index]["height"] = format_distance(plot["height"])
            if "actual width" in plot.keys():
                plot_data[row][index]["actual width"] = format_distance(
                    plot["actual width"])
            if "shift" in plot.keys():
                plot_data[row][index]["shift"] = format_distance(
                    plot["shift"])
        if "width" in row.keys():
            plot_data[row]["width"] = format_distance(
                row["width"])

        if "orientation" in row.keys():
            plot_data[row]["orientation"] = format_angle(
                row["orientation"])

    return plot_data


##### *** TOP LEFT QUARTER *** #####
plot_data_file = open('map_plots_top_left.json', 'r')
plot_data = format_numbers(json.loads(plot_data_file.read()))

## ROW 1 ##
# orientation = direction u r facing when looking @ gravestone
row_orientation = northwest_wall_angle+.125-180
plot2_coords = {"lat": -36.87241435760838, "lng": 174.780340850825}
calc_plot_rows(feet_inch_to_m(8), plot_data["row1_plots"],
               plot2_coords, row_orientation)

# adding first plot (non-rectangle)
calc_plot(feet_inch_to_m(8), feet_inch_to_m(8, 4), add_distance_2(get_plot_coords(
    2)[0], feet_inch_to_m(8, 4), row_orientation), row_orientation, 1, "Whisker")

## ROW 2 ##
# direction same as row 1
calc_plot_rows(feet_inch_to_m(8), plot_data["row2_plots"],
               add_distance_2(add_distance_2(get_plot_coords(plot_data["row1_plots"][0]["plotNumber"])[1], feet_inch_to_m(4), row_orientation+90), 0.5, row_orientation+180), row_orientation)


## ROW 3 ##
calc_plot_rows(feet_inch_to_m(8), plot_data["row3_plots"],
               add_distance_2(
                   add_distance_2(get_plot_coords(plot_data["row2_plots"][0]["plotNumber"])[
                                  1], feet_inch_to_m(4), row_orientation+90),
                   0.1, row_orientation+180),
               row_orientation)


## ROW 4 ##
calc_plot_rows(feet_inch_to_m(8), plot_data["row4_plots"],
               add_distance_2(
                   add_distance_2(get_plot_coords(plot_data["row3_plots"][0]["plotNumber"])[
                                  1], feet_inch_to_m(4), row_orientation+90),
                   0.1, row_orientation+180),
               row_orientation)


## ROW 5 ##
calc_plot_rows(feet_inch_to_m(8), plot_data["row5_plots"],
               add_distance_2(
                   add_distance_2(get_plot_coords(plot_data["row4_plots"][0]["plotNumber"])[
                                  1], feet_inch_to_m(4), row_orientation+90),
                   0.15, row_orientation+180),
               row_orientation)

plot_data_file.close()


##### *** TOP RIGHT QUARTER *** #####
plot_data_file = open('map_plots_top_right.json', 'r')
plot_data = format_numbers(json.loads(plot_data_file.read()))

# 1
plot_orientation = northwest_wall_angle-2.1-180
corner = add_distance_2(get_plot_coords(76)[1], feet_inch_to_m(
    28.94), 111+row_orientation)
# corner = add_distance_2(
#     corner, feet_inch_to_m(1.4), northwest_wall_angle-90)
calc_plot(feet_inch_to_m(8),
          plot_data["row1_plots"][0]["height"],  corner, plot_orientation, plot_data["row1_plots"][0]["plotNumber"], plot_data["row1_plots"][0]["registeredName"])


# 2
corner = add_distance_2(get_plot_coords(82)[3], feet_inch_to_m(
    7.7425), row_orientation-133.5)
row_orientation = plot_orientation+1.5
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row2_plots"], corner, row_orientation)

# 3
corner = add_distance_2(get_plot_coords(85)[3], feet_inch_to_m(
    3.27), row_orientation-117)
row_orientation = row_orientation - .5
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row3_plots"], corner, row_orientation)

# 4
corner = add_distance_2(get_plot_coords(87)[3], feet_inch_to_m(
    2.4), row_orientation-90)
calc_plot_rows(feet_inch_to_m(
    9), plot_data["row4_plots"], corner, row_orientation)

# 5
corner = add_distance_2(get_plot_coords(88)[3], feet_inch_to_m(
    6.193), row_orientation-90)
calc_plot_rows(feet_inch_to_m(
    16), plot_data["row5_plots"], corner, row_orientation)

# 6
corner = add_distance_2(get_plot_coords(89)[3], feet_inch_to_m(
    0.705), row_orientation-90)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row6_plots"], corner, row_orientation)

# 7
corner = add_distance_2(get_plot_coords(90)[3], feet_inch_to_m(
    0.705), row_orientation+90)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row7_plots"], corner, row_orientation)

# 8
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row8_plots"], get_plot_coords(86)[1], row_orientation)

# 9
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row9_plots"], get_plot_coords(
    97)[3], row_orientation)

# 10
corner = add_distance_2(get_plot_coords(
    89)[2], plot_data["row10_plots"][0]["height"], row_orientation)
calc_plot_rows(feet_inch_to_m(
    19), plot_data["row10_plots"], corner, row_orientation)

# 11
calc_plot_rows(feet_inch_to_m(
    19), plot_data["row11_plots"], get_plot_coords(90)[1], row_orientation)

# 12
corner = add_distance_2(get_plot_coords(
    91)[1], feet_inch_to_m(2.1), row_orientation+90)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row12_plots"], corner, row_orientation)

# 13
corner = add_distance_2(get_plot_coords(
    82)[1], feet_inch_to_m(3.5), -row_orientation+90+38)
calc_plot_rows(feet_inch_to_m(
    9), plot_data["row13_plots"], corner, row_orientation)

# 14
corner = add_distance_2(get_plot_coords(
    105)[3], feet_inch_to_m(2.184), row_orientation-90)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row14_plots"], corner, row_orientation)

# 15
corner = add_distance_2(get_plot_coords(
    105)[2], feet_inch_to_m(1.92), row_orientation+90)
corner = add_distance_2(
    corner, plot_data["row15_plots"][0]["height"], row_orientation)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row15_plots"], corner, row_orientation)

# 16
corner = add_distance_2(get_plot_coords(
    118)[1], feet_inch_to_m(4.571), row_orientation+90-16.5)
row_orientation = row_orientation+3.5
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row16_plots"], corner, row_orientation)

# 17
width = 7
corner = add_distance_2(get_plot_coords(
    133)[2], feet_inch_to_m(width), row_orientation-90)
calc_plot_rows(feet_inch_to_m(
    width), plot_data["row17_plots"], corner, row_orientation)

# 18
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row18_plots"], get_plot_coords(130)[1], row_orientation)

plot_data_file.close()


##### *** CENTER *** #####
plot_data_file = open('map_plots_center.json', 'r')
plot_data = format_numbers(json.loads(plot_data_file.read()))

# 1
row_orientation = northwest_wall_angle-1.1-180
corner = add_distance_2(get_plot_coords(95)[3], feet_inch_to_m(
    8.98), row_orientation+90-35-180)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row1_plots"], corner, row_orientation)

# 2
row_orientation = northwest_wall_angle-23-180
corner = add_distance_2(get_plot_coords(152)[3], feet_inch_to_m(
    7), northwest_wall_angle+60)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row2_plots"], corner, row_orientation)

# 3
row_orientation = northwest_wall_angle-1.1-180  # parallel to row1
corner = add_distance_2(get_plot_coords(151)[1], feet_inch_to_m(
    1.2), row_orientation+90)
calc_plot_rows(feet_inch_to_m(
    9), plot_data["row3_plots"], corner, row_orientation)

# 4
corner = add_distance_2(get_plot_coords(152)[1], feet_inch_to_m(
    1.043), row_orientation+180)
row_orientation = row_orientation-6.5
calc_plot_rows(feet_inch_to_m(
    9), plot_data["row4_plots"], corner, row_orientation)

# 5
row_orientation = northwest_wall_angle-23-180  # parallel to #2
corner = add_distance_2(get_plot_coords(153)[2], feet_inch_to_m(
    3.44), row_orientation)
calc_plot_rows(feet_inch_to_m(
    9), plot_data["row5_plots"], corner, row_orientation)

# 6
row_orientation = northwest_wall_angle-1.1-180  # parallel to row 3 & 1
corner = add_distance_2(get_plot_coords(157)[1], feet_inch_to_m(
    0.633), row_orientation)
calc_plot_rows(feet_inch_to_m(
    9), plot_data["row6_plots"], corner, row_orientation)

# 7 - just graves unknown different shape
row_orientation = northwest_wall_angle-1.1-180
corner = add_distance_2(get_plot_coords(150)[3], feet_inch_to_m(
    11.71), row_orientation+42-180)
calc_plot_rows(feet_inch_to_m(
    9), plot_data["row7_plots"], corner, row_orientation)
update_vertex(add_distance_2(get_plot_coords(163)[0], feet_inch_to_m(
    1.5), row_orientation+90+45), 163, 0)
update_vertex(add_distance_2(get_plot_coords(163)[2], feet_inch_to_m(
    -1.5), row_orientation+90+45), 163, 2)
update_vertex(add_distance_2(get_plot_coords(163)[3], feet_inch_to_m(
    1.5), row_orientation), 163, 4)

# 8
row_orientation = northwest_wall_angle-1.1-180-8
corner = add_distance_2(get_plot_coords(150)[3], feet_inch_to_m(
    11.31), row_orientation+16.8-180)
calc_plot_rows(feet_inch_to_m(
    9), plot_data["row8_plots"], corner, row_orientation)

# 8 - Olney Tiles make into a triangle
corner_2_offset = 6.36842  # in feet
update_vertex(add_distance_2(get_plot_coords(167)[3], feet_inch_to_m(
    corner_2_offset), row_orientation+90), 167, 3)
update_vertex(add_distance_2(get_plot_coords(167)[2], feet_inch_to_m(
    9-corner_2_offset, 6), row_orientation-90), 167, 2)

plot_data_file.close()


##### *** BOTTOM *** #####
plot_data_file = open('map_plots_bottom.json', 'r')
plot_data = format_numbers(json.loads(plot_data_file.read()))


# 1
row_orientation = northwest_wall_angle-2.1-180
plot_168_top_left = add_distance_2(get_plot_coords(26)[3], feet_inch_to_m(
    57), northwest_wall_angle-.15)
plot_168_top_left = add_distance_2(
    plot_168_top_left, feet_inch_to_m(1.4), northwest_wall_angle-90)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row1_plots"], plot_168_top_left, row_orientation)


# 2
corner = add_distance_2(get_plot_coords(
    170)[2], feet_inch_to_m(8+3, 4), row_orientation-90)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row2_plots"], corner, row_orientation)


# 3
corner = add_distance_2(get_plot_coords(
    171)[1], feet_inch_to_m(0), row_orientation+180)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row3_plots"], corner, row_orientation)


# 4
row_orientation = northwest_wall_angle+1-180
corner = add_distance_2(get_plot_coords(
    168)[1], feet_inch_to_m(2.2*9), row_orientation+35)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row4_plots"], corner, row_orientation)


# 5
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row5_plots"], get_plot_coords(
    180)[1], row_orientation)

# 6
row_orientation = northwest_wall_angle-180
corner = add_distance_2(get_plot_coords(
    185)[2], feet_inch_to_m(8+4), row_orientation-90)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row6_plots"], corner, row_orientation)


# 7
row_orientation = northwest_wall_angle + 10.5 - 180
corner = add_distance_2(get_plot_coords(
    183)[1], feet_inch_to_m(11.1), northwest_wall_angle-35)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row7_plots"], corner, row_orientation)


# 8
corner = add_distance_2(add_distance_2(get_plot_coords(
    195)[1], feet_inch_to_m(6, 2), row_orientation-180), 0.35, row_orientation+90)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row8_plots"], corner, row_orientation)

# 9
calc_plot(feet_inch_to_m(10), plot_data["row9_plots"][0]["height"], add_distance_2(get_plot_coords(209)[3], feet_inch_to_m(
    4.1), row_orientation+30+180), row_orientation, plot_data["row9_plots"][0]["plotNumber"], plot_data["row9_plots"][0]["registeredName"])

# 10
corner = add_distance_2(get_plot_coords(
    202)[1], feet_inch_to_m(7, 11), row_orientation+35)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row10_plots"], corner, row_orientation)


# 11
corner = add_distance_2(get_plot_coords(
    219)[1], feet_inch_to_m(1, 2), row_orientation+140)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row11_plots"], corner, row_orientation)

# 12
row_orientation = northwest_wall_angle + 6.5 - 180
corner = add_distance_2(get_plot_coords(
    211)[1], feet_inch_to_m(2, 4), row_orientation+90)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row12_plots"], corner, row_orientation)

# 13
row_orientation = northwest_wall_angle - 180
calc_plot_rows(feet_inch_to_m(8), plot_data["row13_plots"], get_plot_coords(230)[
    3], row_orientation)

# 14
row_orientation = northwest_wall_angle + 6.5 - 180
corner = add_distance_2(get_plot_coords(
    225)[1], feet_inch_to_m(9.56), row_orientation+16)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row14_plots"], corner, row_orientation)

# 15
row_orientation = northwest_wall_angle - 180
calc_plot_rows(feet_inch_to_m(8), plot_data["row15_plots"], get_plot_coords(242)[
    3], row_orientation)

# 16
row_orientation = northwest_wall_angle + 6.5 - 180
corner = add_distance_2(get_plot_coords(
    237)[1], feet_inch_to_m(9.56), row_orientation+24)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row16_plots"], corner, row_orientation)

# 17
row_orientation = northwest_wall_angle + 6.5 - 180
corner = add_distance_2(get_plot_coords(
    249)[1], feet_inch_to_m(4.6), row_orientation+80)
calc_plot_rows(feet_inch_to_m(
    8), plot_data["row17_plots"], corner, row_orientation)
plot_data_file.close()
