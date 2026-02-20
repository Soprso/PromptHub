import urllib.request
import json

def check_spaces(query):
    print(f"\n--- Searching HF Spaces for: {query} ---")
    req = urllib.request.Request(f"https://huggingface.co/api/spaces?search={urllib.parse.quote(query)}&limit=20")
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            for space in data:
                space_id = space.get("id")
                # now get status
                try:
                    s_req = urllib.request.Request(f"https://huggingface.co/api/spaces/{space_id}")
                    with urllib.request.urlopen(s_req) as s_res:
                        s_data = json.loads(s_res.read().decode())
                        status = s_data.get("runtime", {}).get("stage", "UNKNOWN")
                        if status == "RUNNING":
                            print(f"[RUNNING] {space_id} (Likes: {space.get('likes', 0)})")
                except Exception:
                    pass
    except Exception as e:
        print(e)

import urllib.parse
check_spaces("hair swap")
check_spaces("head swap")
check_spaces("replace anything")
check_spaces("face and hair")
