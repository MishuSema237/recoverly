# Disk Scheduling - Operating Systems 2

## Introduction
Disk scheduling is basically the technique operating systems use to decide the order in which disk read/write requests get processed. Since traditional hard drives (HDDs) have moving mechanical parts, they are much slower than the CPU. If the OS just handled requests randomly, the drive's "arm" would be jumping all over the place, wasting a lot of time. So, scheduling is all about organizing these requests to make the system run smoother and faster.

## Why is it Important?
The main reasons we need this are:
1.  **Speed**: It reduces the time spent waiting for data.
2.  **Efficiency**: It helps the hard drive do more work in less time.
3.  **Fairness**: It ensures that every process gets a chance to access the disk and nothing gets ignored (starved) for too long.

## What Slows Things Down?
When the computer tries to read data, two main things take time:
*   **Seek Time**: The time it takes for the disk arm to move to the correct "track" or ring on the disk. This is usually the biggest delay.
*   **Rotational Latency**: The time spent waiting for the disk platter to spin around so the right sector is under the reading head.

## The Algorithms (How it decides)
There are a few standard ways the OS can handle the queue of requests:

### 1. FCFS (First Come First Served)
This is the simplest one. The OS handles requests in the exact order they arrive.
*   **Pros**: It's super fair. No complex logic.
*   **Cons**: It's often slow because the disk arm might swing back and forth wildly.

### 2. SSTF (Shortest Seek Time First)
Here, the OS looks at all pending requests and picks the one closest to where the disk arm currently is.
*   **Pros**: Much faster than FCFS because it minimizes arm movement.
*   **Cons**: It can cause "starvation"—if new requests keep coming in close by, a request far away might never get served.

### 3. SCAN (The Elevator Algorithm)
Think of an elevator. The disk arm moves all the way to one end of the disk, serving requests along the way, and then reverses and goes all the way to the other end.
*   **Pros**: Good for heavy loads.
*   **Cons**: If a request arrives just after the "elevator" passes, it has to wait for the arm to go all the way up and come back down.

### 4. C-SCAN (Circular SCAN)
This is like SCAN, but it only works in one direction. When it hits the end, it immediately jumps back to the start without serving requests on the return trip.
*   **Pros**: It provides more consistent wait times compared to normal SCAN.

### 5. LOOK and C-LOOK
These are just optimized versions of SCAN and C-SCAN. Instead of going all the way to the physical end of the disk (even if there are no requests there), the arm only goes as far as the last request in that direction and then reverses. This saves a bit of wasted movement.

## HDD vs. SSD
It's worth noting that all of this applies mostly to traditional Hard Disk Drives (HDDs) with spinning platters. Solid State Drives (SSDs) don't have moving parts, so "seek time" isn't really a thing for them. Because of that, complex disk scheduling isn't nearly as important for modern SSDs.
