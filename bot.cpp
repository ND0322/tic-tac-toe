#include <bits/stdc++.h>
#include <iostream>

using namespace std;
 
const int MAXN = 5e7+5;

int n, board[5][5], pw[20];

int dp[MAXN];

pair<int,int> nxt[MAXN];





void convert(int x){
    for(int i = 0; i < n * n; i++) board[i/n][i%n] = (x / pw[i]) % 3;
}


int dfs(int mask){

    convert(mask);

    int cnt = 0;
    for(int i= 0; i <n ; i++){
        for(int j = 0; j < n; j++) cnt += (bool)board[i][j];
    }

    //lets say ai always moves second 

    //check win

    for(int i = 0; i < n; i++){
        bool flag = 1;

        if(!board[i][0]) continue;
        for(int j = 0; j < n; j++) flag &= board[i][0] == board[i][j];

        if(flag) dp[mask] = !(cnt & 1) + 1;    
    }

    for(int j = 0; j < n; j++){
        bool flag = 1;

        if(!board[0][j]) continue;
        for(int i = 0; i < n; i++) flag &= board[0][j] == board[i][j];

        if(flag) dp[mask] = !(cnt & 1) + 1;    
    }

    bool flag = 0;

    if(board[0][0]){
        flag = 1;
        for(int i = 0; i < n; i++) flag &= (board[0][0] == board[i][i]);
    }

    if(flag) dp[mask] = !(cnt & 1) + 1;    

    flag = 0;

    if(board[n-1][0]){
        flag = 1;
        for(int i = 0; i < n; i++) flag &= (board[n-1][0] == board[n-i-1][i]);
    }

    if(flag) dp[mask] = !(cnt & 1) + 1;    

    
    if(cnt == n * n) dp[mask] = 3;

    if(dp[mask]) return dp[mask];

    dp[mask] = !(cnt & 1) + 1;

    for(int i = 0; i < n; i++){
        for(int j = 0; j < n; j++){
            if(board[i][j]) continue;

            if(dp[mask] == !(cnt & 1) + 1) nxt[mask] = {i,j};

            int nm = mask + (((cnt & 1) + 1) * pw[i * n + j]);

            int res = dfs(nm);
            if(res == (cnt & 1) + 1){
                dp[mask] = (cnt&1)+1;
                nxt[mask] = {i,j};
                return dp[mask];
            }
            if(res == 3){
                dp[mask] = 3;
                nxt[mask] = {i,j};
            }
        }
    }
    return dp[mask];

}

pair<int,int> move(int x){
    return nxt[x];
}

int main(){
    cin >> n;


    pw[0] = 1;

    for(int i = 1; i <= n * n; i++) pw[i] = pw[i-1] * 3;
   
    cout << dfs(0) << "\n";
}