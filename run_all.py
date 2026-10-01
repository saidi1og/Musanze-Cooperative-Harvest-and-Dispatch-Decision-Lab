#!/usr/bin/env python3
"""Root CLI entrypoint for Musanze HarvestLink Decision Pipeline.
Delegates to AI_A1_G09/run_all.py.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.join(BASE_DIR, "AI_A1_G09")
sys.path.insert(0, PROJECT_DIR)

if __name__ == "__main__":
    from AI_A1_G09.run_all import main
    main()
