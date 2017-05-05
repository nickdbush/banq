# Banq (ban-kwe)
Flexible quote learning system (pronounced ban-kwe)

## Quote format
Quotes are represented like this:
```
{quote: `QUOTE TEXT HERE`, tags: [`TAG HERE`, `TAG HERE`]},
```
The comma _is_ important. So are having opening and closing backticks. If it's too complicated for you, send me an email with the quotes and I'll sort it out for you. Tags for a Macbeth quote might look something like
```
tags: [`M to LM`, `Relationships`, `Role reversal`]
```

## Simple usage
Download ```combined.html``` to your computer and edit the quotes in lines 25-27. Ignore all the other rubbish in the file.

## Advanced usage
Download or clone the entire repository into one folder. Then edit ```index.html``` instead, which is cleaner, but has to sit in the same directory as the files ending in ```.js``` and ```.css```, otherwise things will break.