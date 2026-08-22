# MyNSUT Notice Policy

## Objective
To serve as a trusted, central directory for official circulars and notices without fragmenting or duplicating the source of truth.

## Redirect-Based Discovery
MyNSUT **does not** host or author the content of official notices. 
Instead, we store metadata (title, category, source, validity dates) and an `officialUrl`. 
Users click the notice and are securely redirected to the official document hosted on NSUT's infrastructure.

## URL Trust Policy
To prevent phishing or misinformation, the `officialUrl` is strictly validated:
1. It must use HTTPS.
2. It must belong to a configurable allowlist of domains (defaulting to `*.nsut.ac.in`).

Administrators attempting to link an external or untrusted domain will be rejected by the backend validation layer.
