import csv, re
with open("sql_queries/data.sql", "w") as write:
    with open('sql_queries/data.bsv', newline='') as file:
        reader = csv.reader(file, delimiter='|')
        for row in reader:
            book, chapter, lowerVerse, upperVerse = None, None, None, None
            match = re.match(r"(.+?) (\d+)(?::(\d+)(?:-(\d+))?)?", row[3])
            if match:
                book, chapter, lowerVerse, upperVerse = match.groups()
                chapter, lowerVerse, upperVerse = int(chapter), int(lowerVerse) if lowerVerse else None, int(upperVerse) if upperVerse else None
            write.write(f"INSERT INTO dailyblessings.day (date, copticDate, feast, book, chapter, lowerVerse, upperVerse) VALUES ('{row[0]}', '{row[1]}', '{row[2].replace("'","''")}', '{book}', {chapter if chapter is not None else 'NULL'}, {lowerVerse if lowerVerse is not None else 'NULL'}, {upperVerse if upperVerse is not None else 'NULL'});\n")
            questions = [row[4],row[5],row[6]]
            for question in questions:
                if question == '': continue
                isFillInTheBlank = False
                if (question.find("_") > -1):
                    isFillInTheBlank = True
                write.write(f"INSERT INTO dailyblessings.questions (isFillInTheBlank, question, dayId) VALUES ({isFillInTheBlank}, '{question.replace("'","''")}', '{row[0]}');\n")
