#!/usr/bin/env python3
"""Root CLI entrypoint for Single Record Prediction.
Delegates to AI_A1_G09/predict.py.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.join(BASE_DIR, "AI_A1_G09")
sys.path.insert(0, PROJECT_DIR)

if __name__ == "__main__":
    from AI_A1_G09.predict import main
    main()
