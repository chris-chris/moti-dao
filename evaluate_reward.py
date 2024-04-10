import requests
import os

import typer
from collections import defaultdict
from openai import OpenAI

from web3_functions import send_reward

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
NETWORK_ID = os.environ.get("NETWORK_ID")  # astar-zkyoto astar-zkevm


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
    wallet_address_per_user = {
        "chris-chris": "0xE7D2047A8Bb836EE4adC7dF4903C38eBd27DD2f8",
        "future-tech-holic": "0x43B0F187C4882AB02cCE3Bf8f65B7E81687d6E3F"
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
        if user in wallet_address_per_user:
            wallet_address = wallet_address_per_user[user]
            reward = round(comment_count * 0.1 + code_review * 0.2, 8)
            send_reward(NETWORK_ID, wallet_address, reward)
            reward_query += f"- {user}: {reward} vASTR (comments: {comment_count}, code review: {code_review}  )\n"
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
  
  