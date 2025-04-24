import speech_recognition as sr
import pyttsx3

# Initialize the recognizer and the speech engine
recognizer = sr.Recognizer()
engine = pyttsx3.init()

def speak(text):
    """Converts text to speech."""
    engine.say(text)
    engine.runAndWait()

def listen():
    """Listens for audio input from the microphone and converts it to text."""
    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)  # Adjust for ambient noise
        audio = recognizer.listen(source)

        try:
            print("Recognizing...")
            query = recognizer.recognize_google(audio, language='en-US')
            print(f"User said: {query}")
        except sr.UnknownValueError:
            print("ennaku puriyala")
            return ""
        except sr.RequestError:
            print("Sorry, I'm having trouble accessing the speech service.")
            return ""
        
        return query

def main():
    speak("vanakam seethalakshmi Eppati irukkinga? ")
    
    while True:
        query = listen().lower()

        if "hello"  in query:
            speak("Hi there! How can I assist you?")
        
        elif "your name" in query:
            speak("I am your chitti")
        elif "what are you doing" in query:
            speak("assist for you,    how can i help you.")
        
        elif "exit" in query or "bye" in query:
            speak(" ok  Goodbye!")
            break
        
        else:
            speak("ennaku puriyala")

if __name__ == "__main__":
    main()
