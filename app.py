from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


MAXN = int(5e7 + 5)

n = 0
board = [[0] * 5 for _ in range(5)]
pw = [0] * 20

dp = {}
nxt = [(0, 0)] * MAXN


def convert(x):
    for i in range(n * n):
        board[i // n][i % n] = (x // pw[i]) % 3

def check():
    for i in range(n):
        if board[i][0] and all(board[i][0] == board[i][j] for j in range(n)):
            return board[i][0]
        if board[0][i] and all(board[0][i] == board[r][i] for r in range(n)):
            return board[0][i]

    if board[0][0] and all(board[0][0] == board[i][i] for i in range(n)):
        return board[0][0]

    if board[n - 1][0] and all(board[n - 1][0] == board[n - i - 1][i] for i in range(n)):
        return board[n - 1][0]

    return 0


def dfs(mask):
    if mask in dp:
        return dp[mask]
    convert(mask)

    if(check()):
        return -1
    cnt = 0
    for i in range(n):
        for j in range(n):
            cnt += bool(board[i][j])

    # lets say ai always moves second

    # check win

    if(cnt == n * n):
        return 0

    dp[mask] = -2

    for i in range(n):
        for j in range(n):
            if board[i][j]:
                continue

            nm = mask + (((cnt & 1) + 1) * pw[i * n + j])

            res = -dfs(nm)
            convert(mask)

            if(res > dp[mask]):
                dp[mask] = res
                nxt[mask] = (i,j)

            if dp[mask] == 1:
                return dp[mask]

    return dp[mask]

@app.route("/getMove", methods = ["GET"])
def move():
    x = int(request.args.get("x"))
    
    dfs(x)
    print(x)
    print(nxt[x][0], nxt[x][1])
    return {"i": nxt[x][0], "j": nxt[x][1]}


def resetB(size):
    global n, board, pw, dp, nxt

    n = size
    board = [[0] * n for _ in range(n)]

    pw = [1] * (n * n + 1)
    for i in range(1, n * n + 1):
        pw[i] = pw[i - 1] * 3

    max_states = 3 ** (n * n)
    dp = {}
    nxt = [(-1, -1)] * max_states


@app.route("/reset", methods=["POST"])
def reset():
    size = int(request.args.get("n", 3))

    if size not in (3, 4):
        return {"error": "Invalid board size"}, 400

    resetB(size)
    print(size)
    return {"success": True, "n": n}


resetB(3)

if __name__ == '__main__':
    app.run(debug=True)