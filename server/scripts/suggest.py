# scripts/suggest.py
import sys
import json
from transformers import pipeline

generator = pipeline("text2text-generation", model="./models/t5-small")

prompt = sys.argv[1]  # input from Node.js
full_prompt = "summarize edtech"
result = generator(full_prompt, max_new_tokens=128)[0]['generated_text']

print("Raw Output: ",result)  # output to stdout for Node to capture
