Ensuring fairness.

Mechanism 1: Authenticated One-User-One-Vote Enforcement

The application enforces a strict one-user-one-vote policy using authenticated sessions. Each vote is associated with a unique user_id and poll. The backend verifies whether a user has already voted in a poll before allowing insertion.

This mechanism prevents:

Duplicate votes from the same account

Manual API replay attacks

Refresh and repeated submission manipulation

Trade-offs:

Requires user authentication

Vulnerable to multi-account abuse (mitigated by OAuth login)

Mechanism 2: Rate Limiting Using Device Fingerprinting

The system implements short-term rate limiting using a fingerprint constructed from the user’s IP address and user-agent. Before inserting a vote, the backend checks whether the same fingerprint has submitted multiple votes within a one-minute window.

This prevents:

Rapid automated vote flooding

Script-based bot attacks

Mass vote amplification using quick repeated requests

Trade-offs:

Shared IP environments may trigger false positives

Advanced attackers may spoof headers
