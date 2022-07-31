# Date: 06/2022
# Author: Arnav Shekaran (arnard76@gmail.com)
# Desc: Helper Functions required to generating coordinates for graveyard plots

import math
from numbers import Number
from typing import Dict
from pymongo_setup import get_database

# visualize latitude and longitude
# https://fthmb.tqn.com/rrQ9wCXTML9ViuYa29UtMHyvrcA=/1500x1000/filters:fill(auto,1)/Latitude-and-Longitude-58b9d1f35f9b58af5ca889f1.jpg


# Converts ft and in to m
def feet_inch_to_m(feet, inches=0) -> float:
    return feet * 0.3048 + inches * 0.0254


# calc the displacement of moving to different coord
# inverse of add_distance_2()
# not finished!!!!
def displacement_between_coords(coord_initial, coord_final) -> Dict[str, Number]:
    # turns vertical and horizontal displacement into a displacement (i.e. distance & direction)
    def calc_displacement(lat_offset, lng_offset) -> Number:
        distance = math.sqrt(lat_offset**2 + lng_offset**2)
        bearing_from_lat = math.acos(lat_offset/distance)*180/math.pi
        bearing_from_lng = math.asin(lng_offset / distance)*180/math.pi
        return {"distance": distance, "bearing": bearing_from_lat}

    lat_offset = 6378137 * \
        (coord_final["lat"] - coord_initial["lat"])/(180/math.pi)
    lng_offset = 6378137 * \
        math.cos(lat_initial*math.pi/180)*(lng - lng_initial)/(180/math.pi)

    return calc_displacement(lat_offset, lng_offset)


# Add a distance with bearing to lat,lng coords
def add_distance_2(coord, distance, bearing):
    # Add a distance to [lat, long] coordinates
    # reference: https://stackoverflow.com/questions/2839533/adding-distance-to-a-gps-coordinate/2839560
    #            https://stackoverflow.com/questions/15886846/python-elegant-way-of-finding-the-gps-coordinates-of-a-circle-around-a-certain
    def add_distance(lat_initial, lng_initial, lat_offset, lng_offset):
        lat = lat_initial + (180/math.pi)*(lat_offset/6378137)
        lng = lng_initial + (180/math.pi)*(lng_offset /
                                           6378137)/math.cos(lat_initial*math.pi/180)
        return {"lat": lat, "lng": lng}

    # Calculates lat offset (in m) and lng offset (in m) using distance (in m) + bearing (in deg)
    def calc_offsets(distance: float, bearing):
        try:
            return (distance * math.cos(bearing * math.pi/180), distance * math.sin(bearing * math.pi/180))
        except TypeError:
            print("Error:", distance, type(distance))

    offset = calc_offsets(distance, bearing)
    return add_distance(coord["lat"], coord["lng"], offset[0], offset[1])


# calculate 4 vertices of plot
# must specify (pass in) to function: width, height, top left vertex coords, orientation
# * orientation: 0 degrees means that when u are looking @ gravestone, you are looking North
#                90 degrees is east, 180 is south, 270 is west
# * assumes plot is rectangle (has 4 right angles)
# * if plotNumber provided then function updates db
def calc_plot(width, height, top_left, orientation, plotNumber=None, registeredName="Undefined"):
    top_right = add_distance_2(top_left, width, 90+orientation)
    bottom_left = add_distance_2(top_left, height, orientation-180)
    bottom_right = add_distance_2(bottom_left, width, 90+orientation)

    if plotNumber and type(plotNumber) is int:
        print('updated plot', plotNumber)
        upsert_plot({"plotNumber": plotNumber, "registeredName": registeredName,
                    "coordinates": [top_left, top_right, bottom_right, bottom_left]})

    return [top_left, top_right, bottom_right, bottom_left]


# calculate coordinates for a row of plots
# plots = [{"plotNumber": 55, "height": in m},....]
def calc_plot_rows(row_width, plots, first_plot_top_left,  orientation):
    next_plot_top_left = first_plot_top_left
    for plot in plots:
        plot_width = row_width
        top_left = next_plot_top_left

        if "plotNumber" in plot.keys():
            if "actual width" in plot.keys():  # plot has different width than row
                plot_width = plot["actual width"]

            if "align" in plot.keys() and plot["align"] == "right":
                top_left = add_distance_2(
                    next_plot_top_left, row_width-plot_width, orientation+90)
                bottom_left = calc_plot(plot_width, plot["height"], top_left,
                                        orientation, plot["plotNumber"], plot["registeredName"])[3]
                next_plot_top_left = add_distance_2(
                    bottom_left, row_width-plot_width, orientation-90)
            elif "shift" in plot.keys():
                # positive shift is in left direction of plot
                top_left = add_distance_2(
                    top_left, plot["shift"], orientation-90)
                bottom_left = calc_plot(plot_width, plot["height"], top_left,
                                        orientation, plot["plotNumber"], plot["registeredName"])[3]
                next_plot_top_left = add_distance_2(
                    bottom_left, -plot["shift"], orientation-90)
            else:
                next_plot_top_left = calc_plot(plot_width, plot["height"], top_left,
                                               orientation, plot["plotNumber"], plot["registeredName"])[3]
        else:  # for padding between plots
            next_plot_top_left = calc_plot(
                row_width, plot["height"], top_left, orientation)[3]


def get_plot_coords(plotNumber):
    return get_database().get_collection('plots').find_one(
        {"plotNumber": plotNumber})["coordinates"]


# updates a vertex of a plot in db
def update_vertex(coord, plotNumber, corner):
    if type(corner) is int:
        corner = str(corner)
    get_database().get_collection('plots').find_one_and_update(
        {"plotNumber": plotNumber},
        {"$set": {
            "coordinates."+corner: coord}})
    print('updated corner', corner, 'of plot', plotNumber)


# updates plot coordinates (all) in db
def update_coordinates(coordinates, plotNumber):
    get_database().get_collection('plots').find_one_and_update(
        {"plotNumber": plotNumber},
        {"$set": {"coordinates": coordinates}})


def upsert_plot(plot):
    get_database().get_collection('plots').update_one(
        {"plotNumber": plot["plotNumber"]}, {"$set": plot}, upsert=True)
