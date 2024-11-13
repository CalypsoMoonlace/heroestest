#!/usr/bin/env python
import os.path
import sys

# Open script file with absolute path to import database_edits
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
script_folder = os.path.join(BASE_DIR, "Script")
conversion_folder = os.path.join(script_folder, "conversion")
sys.path.append(conversion_folder)

import database_edits

# Start of generator
# Delete old overview.html file
overview_template_file = open("overview_placeholder.html","r")
generated_overview = overview_template_file.read()
print(generated_overview)

roles_list = ["trialhelper","helper","trialminimod","minimod","mod","megamod","mentor","mentormanagerhelper",
              "mentormanager","guardian","guardianmanagerhelper","guardianmanager","reddit","facebook","instagram","twitter","tc_mod","tc_admin"]
# Dev is not included, this one has to be done manually


for role in roles_list:
    # Fetch data
    category = database_edits.get_category(role)
    users_with_role = database_edits.cursor.execute(f"""SELECT name FROM {category} WHERE current='{role}' OR current LIKE '% {role}' OR current LIKE '{role} %';""").fetchall()
    # ABOUT THAT QUERY: It is valid because only SMMs can have several position at once! Be very careful about false positives if editing this
    name_list = [item[0] for item in users_with_role]
    
    # Convert data to html
    result = ""
    for name in name_list:
        result += '<a class="name_link">' + name + '</a><br>\n'
    if not name_list:
        result = "None"
    
    # Replace placeholder with generated html
    generated_overview = generated_overview.replace("PLACEHOLDER_" + role + "_END", result)

# Replace old overview.html file with newly generated overview
overview_file = open("overview.html","w")
overview_file.write(generated_overview)
    