import pyttsx3

# Initialize the text-to-speech engine
engine = pyttsx3.init()

# Get and print the available voices
voices = engine.getProperty('voices')

for index, voice in enumerate(voices):
    print(f"Voice {index + 1}:")
    print(f"ID: {voice.id}")
    print(f"Name: {voice.name}")
    print(f"Languages: {voice.languages}")
    print(f"Gender: {voice.gender}")
    print(f"Age: {voice.age}")
    print("="*20)

# Optionally, try setting one of the voices manually
engine.setProperty('voice', voices[1].id)  # You may need to change the index
engine.say("Hello, how can I help you today?")
engine.runAndWait()
