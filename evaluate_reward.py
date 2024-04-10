import requests
import os

import typer
from collections import defaultdict
from openai import OpenAI
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


app = typer.Typer()


def comments(repo_owner, repo_name, pr_number):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{pr_number}/comments"
    headers = {
        "Authorization": f"Bearer {os.environ.get('GITHUB_TOKEN')}",
    }
    response = requests.get(url, headers=headers)
    return response.json()


def post_commnet(repo_owner, repo_name, pr_number, body):
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{pr_number}/comments"
    headers = {
        "Authorization": f"Bearer {os.environ.get('GITHUB_TOKEN')}",
    }
    data = {
        "body": body
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()


@app.command()
def main(repo_owner:str, repo_name:str, pr_number:str):
    account_id_per_user = {
        "chris-chris": "67a3c5ae1a8d652196a67c5619258c9c6248d8ee2b67616a8aa5e62288806bcd",
        "future-tech-holic": "c680df9848b56d8a5e8c33b45407f40dd2c5780e093f0142e7be72af04365334"
    }
    comment_data = comments(repo_owner, repo_name, pr_number)
    comment_count_per_user = defaultdict(int)
    code_review_per_user = defaultdict(int)
    for comment in comment_data:
        user = comment['user']['login']
        comment_count_per_user[user] += 1
        body = comment['body']
        print(body)
        if body.startswith("Score: "):
            score = int(body.split(":")[1].strip())
            code_review_per_user[user] += score
    print(comment_data)
    query = "Please write a persuasive sentence that each member will receive fair reward according to their qualatative and quantatitive efforts. I calculated the contribution of each member for this PR. and notify each member's reward.\n"
    reward_query = ""
    for user, comment_count in comment_count_per_user.items():
        code_review = code_review_per_user[user]
        print(f"{user}: {comment_count}")
        if user in account_id_per_user:
            account_id = account_id_per_user[user]
            reward = round(comment_count * 0.0001 + code_review * 0.0002, 8)
            command = f"dfx ledger --network=ic transfer {account_id} --amount {reward} --memo 1234"
            print(command)
            reward_query += f"- {user}: {reward} ICP (comments: {comment_count}, code review: {code_review}  )\n"
            os.system(command)
    query += reward_query
    print(query)

    response = client.chat.completions.create(
      model="gpt-3.5-turbo",
      messages=[
        {"role": "system", "content": "You are a fair governer who evaluate equally and fairly, and persuasive and rightful."},
        {"role": "user", "content": query}
      ]
    )
    print(response.choices[0].message.content)
    gpt_response = response.choices[0].message.content
    final_response = gpt_response + "\n" + reward_query
    post_commnet(repo_owner, repo_name, pr_number, final_response)
    return final_response

if __name__ == "__main__":
    app()
  
  