"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gemini_1 = require("../services/gemini");
exports.default = {
    async analyze(ctx) {
        var _a;
        const file = (_a = ctx.request.files) === null || _a === void 0 ? void 0 : _a.image;
        if (!file)
            return ctx.badRequest('No image uploaded');
        const filePath = file.filepath;
        try {
            const result = await (0, gemini_1.analyzeImage)(filePath);
            return ctx.send({ success: true, result });
        }
        catch (error) {
            ctx.internalServerError("Analysis failed", { error: error.message });
        }
    }
};
