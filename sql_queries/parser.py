import csv, re
name = "5th Grade"
with open(f"sql_queries/curriculum_{name}.sql", "w") as write:
    write.write(f"INSERT INTO dailyblessings.curriculum (name) VALUES ('{name}');\n")
    with open('sql_queries/data.bsv', newline='') as file:
        reader = csv.reader(file, delimiter='|')
        dayIndex = 0
        for row in reader:
            book, chapter, lowerVerse, upperVerse = None, None, None, None
            match = re.match(r"(.+?) (\d+)(?::(\d+)(?:-(\d+))?)?", row[3])
            if match:
                book, chapter, lowerVerse, upperVerse = match.groups()
                chapter, lowerVerse, upperVerse = int(chapter), int(lowerVerse) if lowerVerse else None, int(upperVerse) if upperVerse else None
            # write.write(f"INSERT INTO dailyblessings.day (date, copticDate, feast) VALUES ('{row[0]}', '{row[1]}', '{row[2].replace("'","''")}');\n")
            write.write(f"INSERT INTO dailyblessings.curriculum_day (curriculumId, dayIndex, book, chapter, lowerVerse, upperVerse) VALUES ((SELECT COUNT(*) FROM dailyblessings.curriculum), '{dayIndex}', '{book}', {chapter if chapter is not None else 'NULL'}, {lowerVerse if lowerVerse is not None else 'NULL'}, {upperVerse if upperVerse is not None else 'NULL'});\n")
            questions = [row[4],row[5],row[6]]
            for question in questions:
                if question == '': continue
                isFillInTheBlank = False
                if (question.find("_") > -1):
                    isFillInTheBlank = True
                write.write(f"INSERT INTO dailyblessings.curriculum_questions (isFillInTheBlank, question, curriculumId, dayIndex) VALUES ({isFillInTheBlank}, '{question.replace("'","''")}', (SELECT COUNT(*) FROM dailyblessings.curriculum), '{dayIndex}');\n")
            dayIndex += 1
