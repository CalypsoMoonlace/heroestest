#!/usr/bin/env python

import sqlite3
import os.path

# Open database with absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "staff_database.sqlite")
conn = sqlite3.connect(db_path)

# Use cursor to send instructions
cursor = conn.cursor()

def show_instructions():
    print('''
    COMMANDS:
        - add staff: add a new staff member (will be done for you if you try to edit a non-existent staff)
        - edit staff: add a new role to a staff member (e.g. minimod promotions, resigns)
        - fix staff: change already existing values (e.g. name change, removing birthday)
        - delete staff: delete a staff entry
        
        - add role: add a new role (required before updating staff member to that role)
        - fix role: edit an existing role (e.g. description updates)
        - delete role: delete a role
        
        - add category: add a new table
        - fix category: rename a table
        - delete category: delete a table
        
        - exit: save all changes (SAVES WILL NOT BE CHANGED UNLESS YOU EXIT SAFELY)
        - verify: automatically corrects "current" fields if needed
        - manual: enter a manual SQL command (for debugging - only use if you really know what you're doing)
        - help: shows this text
        
        If at any point, you are supposed to give several arguments (e.g. a list of names), seperate them with a space
        ''')

# Main function
def running():
    command = input("\nENTER YOUR COMMAND: ")
    print("")
    
    # help
    if command == "help":
        show_instructions()
    
    # add staff
    elif command == "add staff":
        print("ADDING A NEW STAFF MEMBER")
        
        name = input("\tName: ")
        categories = input("\Categories: ")
        languages = input("\tLanguage(s): ")
        birthday = input("\tBirthday (optional): ")
        
        add_staff(name,categories,languages,birthday)
    
    # edit staff
    elif command == "edit staff":
        print("EDITING A STAFF MEMBER")
        
        names = input("\tNames: ").split()
        role = input("\tRole: ")
        value = input("\tValue: ")
        edit_staff(names,role,value)
        
    # fix staff
    elif command == "fix staff":
        print("CORRECTING STAFF MEMBER PERSONAL FIELDS") # No I was not going to put "fixing staff" because that sounds weird ngl
        
        name = input("\tName: ")
        field = input("\tField: ")
        fix_staff(name,field)
    
    # delete staff
    elif command == "delete staff":
        print("REMOVING A STAFF MEMBER")
        
        name = input("\tName: ")
        delete_staff(name)
    
    # add role
    elif command == "add role":
        print("ADDING A ROLE")
        
        name = input("\tName : ")
        category = input("\tCategory: ")
        display = input("\tDisplay name: ")
        description = input("\tDescription: ")
        colour = input("\tColour: ")

        print('The next question is the "show_higher" field. This field is set to NO for all Discord roles and manager helpers, and set to YES for the rest')
        show_higher = input('\tShould users with this role appear when looked up with a "lower" role? (y/n): ')

        # Check if input valid
        while show_higher.lower() not in ["y","n","yes","no","1","0"]:
            print("Invalid input, answer with Yes or No")
            show_higher = input('\tShould users with this role appear when looked up with a "lower" role? (y/n): ')

        add_role(name,category,display,description,colour,show_higher)
    
    # fix role
    elif command == "fix role":
        print("CORRECTING ROLE FIELDS")
        
        name = input("\tName: ")
        field = input("\tField: ")
        fix_role(name,field)

    # delete role
    elif command == "delete role":
        print("REMOVING A ROLE")
        
        name = input("\tName: ")
        delete_role(name)
    
    # add category
    elif command == "add category":
        print("ADDING A CATEGORY")
        
        name = input("\tName: ")
        add_category(name)
    
    # fix category
    elif command == "fix category":
        print("CORRECTING CATEGORY NAME")
        
        name = input("\tCurrent name: ")
        new_name = input("\tNew name: ")
        fix_category(name,new_name)
    
    # delete category
    elif command == "delete category":
        print("REMOVING CATEGORY")
        
        name = input("\tName: ")
        delete_category(name)

    # verify current
    elif command == "verify":
        print("VERIFICATION OF CURRENT FIELD VALIDITY")
        
        verify()

    # Debugging
    elif command == "manual":
        for row in cursor.execute(input("Enter a manual command: ")):
            print(row)
    
    # Wrong argument, show help
    elif command != "exit":
        print("Invalid command")
        show_instructions()
    
    # exit
    if command != "exit":
        running()
    
def get_category(role):
    # pre: role is a string
    # post: returns the category of that role
    if role in ["resigned","resigned_from"]:
        return input("This field is in many tables. Please specify which table to edit: ")
    
    cursor.execute("SELECT * FROM Role WHERE name=?",(role,))
    entry = cursor.fetchone()
    
    if entry is not None:
        return entry[1]
    else:
        raise ValueError(f"{role} is not a valid role")

def add_to_category(category,username,current):
    # pre: category & username are strings
    #      username is in Member table
    # post: add staff to category table
    staff = cursor.execute(f"SELECT languages FROM Member WHERE name=?",(username,))
    entry = staff.fetchone()
    
    if entry[0] == "English":
        languages = "English"
    else:
        languages = entry[0].replace("English","")
        languages = languages.replace("  "," ").strip() # avoid extra spaces
    
    cursor.execute(f"INSERT INTO {category} (name,current,languages) VALUES ( ?,?,? )",(username,current,languages))
    print(f"Added {username} into the {category} table")

def add_staff(name,category,languages,birthday):
    # pre: name, category, languages & birthday are strings
    #      name is not None
    # post: add staff to db
        
    # Default settings
    if not category:
        print("Category can't be empty")
        return
    if not languages:
        languages = "English"
    if not birthday:
        birthday = None
        
    cursor.execute("INSERT INTO Member(name,categories,languages,birthday) VALUES( ?,?,?,? )",(name,category,languages,birthday))
    print(f"Added {name} into the database Member")
    
def edit_staff(names,role,value):
    # pre: name, category, languages & birthday are strings
    #      name is not None
    # post: add staff to db
    category = get_category(role)
    
    for username in names:
        staff = cursor.execute(f"SELECT categories FROM Member WHERE name=?",(username,))
        entry = staff.fetchone()
        
        # add staff if it doesn't already exist
        if entry is None:
            # staff not in Member
            add_staff(username,category,"English",None)
            add_to_category(category,username,role)
            
        elif (entry[0] is None):
            # staff in Member but doesn't have any category yet
            cursor.execute(f"UPDATE Member SET categories=? WHERE name=?",(category,username))
            add_to_category(category,username,role)
        
        elif (category not in entry[0]):
            # staff in Member but doesn't have corresponding category yet
            new_categories = (entry[0] + " " + category).strip()
            cursor.execute(f"UPDATE Member SET categories=? WHERE name=?",(new_categories,username))
            add_to_category(category,username,role)
            
        # Adding the actual value to the role field & to the current field
        cursor.execute(f"UPDATE {category} SET {role}=? WHERE name=?",(value,username))
        cursor.execute(f"UPDATE {category} SET current=? WHERE name=?",(role,username))
            
    print(f"Set {role} to {value} in the {category} table for {names}")

def fix_staff(username,field):
    # pre: username and field are strings
    #      username is already in the member database and field is a valid field
    # post: asks the user for input and sets the field to that new value
    category = ""
    
    # Find which table field is from
    for row in cursor.execute("PRAGMA table_info('Member')"):
        if row[1] == field:
            category = "Member"
    
    if not category:
        category = get_category(field)

    # Get new value
    entry = cursor.execute(f"SELECT {field} FROM {category} WHERE name=?",(username,)).fetchone()
    print(f"The current value is: {entry[0]}")
    value = input("\tEnter new value: ")
    
    # Set new value
    cursor.execute(f"UPDATE {category} SET {field}=? WHERE name=?",(value,username))
    print(f"Set {field} to {value} for {username} in the {category} table")

    # If field is the name, we also need to change it in the other tables
    if field == "name":
        categories = cursor.execute(f"SELECT categories FROM Member WHERE name=?",(value,)).fetchone()

        for category in categories[0].split():
            cursor.execute(f"UPDATE {category} SET name=? WHERE name=?",(value,username))
            print(f"Renamed {entry[0]} to {value} in the {category} table")
    
    # If field is the languages, we also need to change it in the other tables
    if field == "languages":
        languages = value.replace("English","")
        languages = languages.replace("  "," ").strip() # avoid extra spaces

        categories = cursor.execute(f"SELECT categories FROM Member WHERE name=?",(username,)).fetchone()

        for category in categories[0].split():
            cursor.execute(f"UPDATE {category} SET languages=? WHERE name=?",(languages,username))
            print(f"Set languages to {languages} in the {category} table")


def delete_staff(name):
    # pre: name is a string
    # post: remove staff from db if it exists
    staff = cursor.execute("SELECT * FROM Member WHERE name=?",(name,))
    
    if staff.fetchone() is not None:
        # Get category data before deleting it
        categories = cursor.execute(f"SELECT categories FROM Member WHERE name=?",(name,)).fetchone()
        
        # Delete from categories
        for category in categories[0].split():
            cursor.execute(f"DELETE FROM {category} WHERE name=?",(name,))
            print(f"Removed {name} from {category}")

        # Delete from Member
        cursor.execute("DELETE FROM Member WHERE name=?",(name,))
        print(f"Removed {name} from the Member database")

    else:
        # staff.fetchone() == None if no results
        print(f"{name} is not in the Member database")

def add_role(name,category,display,description,colour,show_higher):
    # pre: name, category, display, description & colour are strings
    #      show_higher is one of the following: ["y","n","yes","no","1","0"]
    # post: add role to db

    # convert show_higher to boolean
    if show_higher.lower() in ["y","yes","1"]:
        show_higher = 1
    else:
        show_higher = 0

    # add to Role db
    cursor.execute("INSERT INTO Role(name,category,display_name,description,colour,show_higher,creation) VALUES( ?,?,?,?,?,?,? )",(name,category,display,description,colour,show_higher,0))
    print(f"Added {name} into the database Role")

    # modify category database to add a field for that role
    cursor.execute(f'''ALTER TABLE {category}
                        ADD {name} TEXT''')
    print(f"Added {name} into the database {category}")

def fix_role(role_name,field):
    # pre: role_name and field are strings
    #      role_name is already in the Role database and field is a valid field
    # post: asks the user for input and sets the field to that new value
    
    # Fetch some info
    category = get_category(role_name)
    entry = cursor.execute(f"SELECT {field} FROM Role WHERE name=?",(role_name,)).fetchone()

    # Get new value
    print(f"The current value is: {entry[0]}")
    value = input("\tEnter new value: ")
    
    # Set new value
    cursor.execute(f"UPDATE Role SET {field}=? WHERE name=?",(value,role_name))
    print(f"Set {field} to {value} for {role_name} in the Role table")

    # If field is the name, we also need to change it in the table
    if field == "name":
        cursor.execute(f'''ALTER TABLE {category} 
                       RENAME COLUMN {entry[0]} TO {value}''')
        print(f"Renamed {entry[0]} to {value} in the {category} table")
    
    # If field is the category, we also need to move it to a new table
    if field == "category":
        cursor.execute(f'''ALTER TABLE {value}
                       ADD {role_name} TEXT''')  # Create new column
        cursor.execute(f'''ALTER TABLE {category}
                       DROP COLUMN {role_name}''') # Destroy old column
        print(f"Moved {role_name} to {value}")
        print(f"Transferring existing fields is not currently supported, all fields are initiated to NULL")

def delete_role(role_name):
    # pre: role_name is a string
    # post: remove role from db if it exists
    role = cursor.execute("SELECT * FROM Role WHERE name=?",(role_name,))
    
    if role.fetchone() is not None:
        # Delete from its own category
        category = get_category(role_name)
        cursor.execute(f'''ALTER TABLE {category}
                       DROP COLUMN {role_name}''')
        print(f"Removed {role_name} from {category}")

        # Delete from Role
        cursor.execute("DELETE FROM Role WHERE name=?",(role_name,))
        print(f"Removed {role_name} from the database Role")
    else:
        # role.fetchone() == None if no results
        print(f"{role_name} is not in the Role database")

def add_category(name):
    # pre: name is a string
    # post: creates a new table with that name

    # all tables should have name as primary key and contain: current, languages, resigned, resigned_from
    cursor.execute(f'''CREATE TABLE {name} (
                   name TEXT PRIMARY KEY,
                   current TEXT NOT NULL,
                   languages TEXT NOT NULL,
                   resigned TEXT,
                   resigned_from TEXT
                   )
                   ''')
    print(f"Created table {name}")

def fix_category(name,new_name):
    # pre: name is a string of a table
    # post: renames that table to new_name
    
    # rename table
    cursor.execute(f'''ALTER TABLE {name}
                   RENAME TO {new_name}''')
    print(f"Renamed {name} to {new_name}")

    # edit categories in Role db
    cursor.execute(f"UPDATE Role SET category=? WHERE category=?",(new_name,name))
    print(f"Changed {name} to {new_name} in the Role database")

    # edit categories in Member db
    cursor.execute(f"UPDATE Member SET categories = REPLACE(categories,?,?)",(name,new_name))
    print(f"Changed {name} to {new_name} in the Member database")

def delete_category(name):
    # pre: name is a string of a table
    # post: remove that table from the database
    if name in ["Member","Role"]:
        raise ValueError("This table cannot be deleted")
    
    # drop table
    cursor.execute(f"DROP TABLE {name}")
    print(f"Removed table {name}")

    # remove from roles
    cursor.execute("DELETE FROM Role WHERE category=?",(name,))
    print(f"Removed roles associated to {name}")
    
    # remove members who only have that category (category can't be NULL)
    cursor.execute("DELETE FROM Member WHERE categories=?",(name,))
    print(f"Removed members that were only in {name}")

    # remove that category from members who have more than one category
    cursor.execute(f'''UPDATE Member 
                   SET categories = trim(REPLACE(REPLACE(categories,?,?), "  "," "))
                   ''',(name,"")) # replace & avoid extra spaces
    print(f"Updated member categories for who was in {name}")

def verify():
    # pre: database is made of a set of tables with Member, Role as the only non-category tables
    # post: verifies database integrity by setting "current" fields in the category tables to their proper values if needed

    tables = cursor.execute("""SELECT name FROM sqlite_master WHERE type='table'""").fetchall()
    for table in tables:
        # for each table

        if table[0] in ["Member","Role","SocialMedia"]: # ignore the first two cause they're not unix values, and the third because it doesn't work that way
            continue
        
        rows = cursor.execute(f"""SELECT * FROM {table[0]}""").fetchall()
        for row in rows:
            # for each member, find what is their real current
            
            current_index = find_latest(row)
            row_names = cursor.execute(f"""PRAGMA table_info({table[0]})""").fetchall() # list of all columns
            real_current = row_names[current_index][1]

            # update current
            if real_current != row[1]:
                cursor.execute(f"""UPDATE {table[0]} SET current=? WHERE name=?""",(real_current,row[0]))
                print(f"Set current to {real_current} for {row[0]} in {table[0]}")
                
    print("Verification finished")

def find_latest(row):
    # pre: row is a sql result row from SELECT *
    # post: returns the ID for the maximal unix value (= most recent update)
    maximum = 0
    max_id = 0
    for index,values in enumerate(row):
        if index != 2 and index < 5: # name, current, resigned_from, languages are ignored as they are not unix values
            continue

        if values is None: # ignore empty fields
            continue

        for value in str(values).split(): # might contain several unix values at once
            if int(value) > maximum: # update maximum
                maximum = int(value)
                max_id = index

    return max_id




# Start main program
show_instructions()
running()

# Save modifications
print("Saving all changes...")
conn.commit()

# Close database
conn.close()
print("All changes saved")