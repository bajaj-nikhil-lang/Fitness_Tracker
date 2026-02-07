"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "POST",
            path: "/image-analysis",
            handler: "image-analysis.analyze",
            config: { auth: false },
        }
    ]
};
