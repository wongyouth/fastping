## Find the fastest node from candidates by ping time

List all nodes in a file line by line, and `fastping` will ping every node 3 times to get a mean ping time.
After all nodes have pinged. fastping will give you the fastest node and the mean ping time of it.

The way you are supposed to use it looks like below:

    cat 220.194.79.22  >> nodes
    cat 118.212.234.22 >> nodes
    cat 220.195.19.20  >> nodes
    cat 220.194.224.16 >> nodes
    cat 153.37.238.142 >> nodes
    cat 118.212.234.12 >> nodes
    cat 123.125.46.142 >> nodes
    cat 220.194.224.15 >> nodes
    cat 153.37.238.143 >> nodes
    cat 153.37.238.144 >> nodes
    cat 220.195.19.21  >> nodes
    cat 123.125.46.162 >> nodes
    cat 118.212.234.21 >> nodes
    cat 123.125.46.31  >> nodes
    cat 220.194.79.12  >> nodes

    fastping -f nodes

I find it's useful to find the best one from a list of VPN server candidates.
