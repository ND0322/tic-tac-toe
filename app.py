from flask import Flask, request

app = Flask(__name__)


MAXN = int(5e7 + 5)

n = 0
board = [[0] * 5 for _ in range(5)]
pw = [0] * 20

dp = [0] * MAXN
nxt = [(0, 0)] * MAXN


def convert(x):
    for i in range(n * n):
        board[i // n][i % n] = (x // pw[i]) % 3


def dfs(mask):
    convert(mask)

    cnt = 0
    for i in range(n):
        for j in range(n):
            cnt += bool(board[i][j])

    # lets say ai always moves second

    # check win

    for i in range(n):
        flag = True

        if not board[i][0]:
            continue

        for j in range(n):
            flag = flag and board[i][0] == board[i][j]

        if flag:
            dp[mask] = int(not (cnt & 1)) + 1

    for j in range(n):
        flag = True

        if not board[0][j]:
            continue

        for i in range(n):
            flag = flag and board[0][j] == board[i][j]

        if flag:
            dp[mask] = int(not (cnt & 1)) + 1

    flag = False

    if board[0][0]:
        flag = True
        for i in range(n):
            flag = flag and (board[0][0] == board[i][i])

    if flag:
        dp[mask] = int(not (cnt & 1)) + 1

    flag = False

    if board[n - 1][0]:
        flag = True
        for i in range(n):
            flag = flag and (
                board[n - 1][0] == board[n - i - 1][i]
            )

    if flag:
        dp[mask] = int(not (cnt & 1)) + 1

    if cnt == n * n:
        dp[mask] = 3

    if dp[mask]:
        return dp[mask]

    dp[mask] = int(not (cnt & 1)) + 1

    for i in range(n):
        for j in range(n):
            if board[i][j]:
                continue

            if dp[mask] == int(not (cnt & 1)) + 1:
                nxt[mask] = (i, j)

            nm = mask + (((cnt & 1) + 1) * pw[i * n + j])

            res = dfs(nm)

            if res == (cnt & 1) + 1:
                dp[mask] = (cnt & 1) + 1
                nxt[mask] = (i, j)
                return dp[mask]

            if res == 3:
                dp[mask] = 3
                nxt[mask] = (i, j)

    return dp[mask]

@app.route("/getMove", methods = ["GET"])
def move():
    x = int(request.args.get("x"))
    dfs(x)
    return {"i": nxt[x][0], "j": nxt[x][1]}


n = int(input())

pw[0] = 1

for i in range(1, n * n + 1):
    pw[i] = pw[i - 1] * 3

if __name__ == '__main__':
    app.run(debug=True)