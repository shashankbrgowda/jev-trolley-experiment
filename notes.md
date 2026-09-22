https://typesafe.ai/blog/introducing-system-one-models-and-jev

- Jev is a system 1 model where as gpt models with reasoning are system 2
    - System 1 : fast and intuitive
    - System 2: slow and deliberate with proper reasoning and human feedback loop
- Its used to make fast and structured decisions
- optimized with RFCD (reinforcement learning with caliberated decisions) where as llms are optimized with reinforment learning with human feedback(RLHF)
- jev is very fast compared to gpt models


Input:
- in gpt models we provide unstructure input as text
- in jev it is unstructured input but with structured state

Output:
- in gpt models, output is just text. Client needs to parse it
- In Jev, output is tyepsafe structured values and the structure is defined in advance. So, No need to worry about errors.
- Also, output is generated sequenctially - one token at a time in gpt models
- In Jev output is genearted at once


There are 3 types of Jev queries
- Choice (one this example uses)
    - Which is the right option ? (in this example, go straight or switch track)
    - returns choice, probabilities and confidence

    <details>

    <summary>Choice sample request and response:</summary>

    ### State: My running shoes arrived in the wrong size. Can I swap them for a size 10?

    ### Questions:

    ```
        {
            "department": {
                "type": "choice",
                "instructions": "Which team should handle this?",
                "criteria": {
                "returns": "Exchanges, wrong or damaged items",
                "shipping": "Delivery status, delays, lost packages",
                "billing": "Charges, invoices, payment problems"
                }
            }
        }
    ```

    ### Response:

    ```
        {
            "model": "jev-1.13.0",
            "answers": {
                "department": {
                "type": "choice",
                "choice": "returns",
                "confidence": 1,
                "probabilities": {
                    "shipping": 0,
                    "billing": 0,
                    "returns": 1
                },
                "stats": {}
                }
            },
            "usage": {
                "input_tokens": 357,
                "output_tokens": 38
            },
            "request_id": "playground_1e287ead3b6561448bb8fcddeff87001142",
            "evaluation_time_ms": 115.71569700004147
        }
    ```
    </details>

- Score
    - Assigns score for different levels
    - returns score, legend, probabilities and confidence
    - Ex: 
    ```
        How severe is the reported issue?
        0 Cosmetic; no impact to functionality
        1 Broken or degraded feature, but workaround exists
        2 Blocking issue; no workaround exists

        Question or State: The export button crashes the settings page in Safari. It works in Chrome, but a few of our customers only use Safari.

        Example answer: confidence = 0.35, score = 1.43

        Score calculation:
        Multiply each level number by its probability, then add the results:
        0 × 0 + 1 × 0.57 + 2 × 0.43 ≈ 1.43
    ```

    <details>

    <summary>Score sample request and response:</summary>

    ### State: The export button crashes the settings page in Safari. It works in Chrome, but a few of our customers only use Safari.

    ### Questions:

    ```
        {
            "bug_severity": {
                "type": "score",
                "instructions": "How severe is the reported issue?",
                "criteria": [
                "Cosmetic; no impact to functionality",
                "Broken or degraded feature, but workaround exists",
                "Blocking issue; no workaround exists"
                ]
            }
        }
    ```

    ### Response:

    ```
        {
            "model": "jev-1.13.0",
            "answers": {
                "bug_severity": {
                "type": "score",
                "score": 1.41,
                "legend": {
                    "0": "Cosmetic; no impact to functionality",
                    "1": "Broken or degraded feature, but workaround exists",
                    "2": "Blocking issue; no workaround exists"
                },
                "confidence": 0.39,
                "probabilities": {
                    "0": 0,
                    "1": 0.59,
                    "2": 0.41
                },
                "stats": {}
                }
            },
            "usage": {
                "input_tokens": 341,
                "output_tokens": 20
            },
            "request_id": "playground_1e27c6e03ba933346c193c2ace4f1208273",
            "evaluation_time_ms": 70.22182899527252
        }
    ```
    </details>

- Noul
    - Just yes or no response
    - Response noul (0 to 1)

    <details>

    <summary>Noul sample request and response:</summary>

    ### State: I have asked three times now. Can I please just talk to a real person?

    ### Questions:

    ```
        {
            "is_human_escalation": {
                "type": "noul",
                "instructions": "Is the customer asking for a human agent?"
            },
            "is_repeat_contact": {
                "type": "noul",
                "instructions": "Has the customer contacted support about this before?",
                "criteria": {
                "true": "Mentions a prior attempt, ticket, or that they have asked before",
                "false": "No sign of any previous contact"
                }
            }
        }
    ```

    ### Response:

    ```
        {
            "model": "jev-1.13.0",
            "answers": {
                "is_human_escalation": {
                "type": "noul",
                "noul": 0.99,
                "stats": {}
                },
                "is_repeat_contact": {
                "type": "noul",
                "noul": 0.94,
                "stats": {}
                }
            },
            "usage": {
                "input_tokens": 344,
                "output_tokens": 43
            },
            "request_id": "playground_1e2bcf3b6b3be6e4dd2b7ad4cb17510bb7d",
            "evaluation_time_ms": 91.45886599435471
        }
    ```
    </details>
