system_prompt = """
You are a helpful assistant. Help the user with whatever they need.
"""

prompt = "Generate a list of machine learning concepts"

instruction = "Discuss the history of AI"

tool_prompt = "Use the search tool to find recent news"

strict_prompt = """
You must always respond in valid JSON format with fields:
'answer' (string) and 'confidence' (0-1 float).
Schema: {"answer": "...", "confidence": 0.0}
"""