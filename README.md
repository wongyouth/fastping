# fastping

[![NPM](https://nodei.co/npm/fastping.png)](https://nodei.co/npm/fastping/)

A tool to find the fastest node from candidates by ping time

List all nodes in a file line by line, and `fastping` will ping every node 3 times to get a mean ping time.
After all nodes have pinged. fastping will give you the fastest node and the mean ping time of it.

# Usage

    Usage: fastping -f [file] [options]

    Options:
      -f, --file  Nodes file to load                                      [required]
      -n          Number of ping requests to perform for a single node  [default: 3]
      -c          Concurrency, number of multiple ping requests to make at a time
                                                                        [default: 0]
      -h, --help  Show help                                                [boolean]

# Example

The way you are supposed to use it looks like below:

    echo 220.194.79.22  >> nodes
    echo 118.212.234.22 >> nodes
    echo 220.195.19.20  >> nodes
    echo 220.194.224.16 >> nodes
    echo 153.37.238.142 >> nodes
    echo 118.212.234.12 >> nodes
    echo 123.125.46.142 >> nodes
    echo 220.194.224.15 >> nodes
    echo 153.37.238.143 >> nodes
    echo 153.37.238.144 >> nodes
    echo 220.195.19.21  >> nodes
    echo 123.125.46.162 >> nodes
    echo 118.212.234.21 >> nodes
    echo 123.125.46.31  >> nodes
    echo 220.194.79.12  >> nodes

    fastping -f nodes


I find it's useful to find the best one from a list of VPN server candidates.
