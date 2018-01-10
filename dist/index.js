"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const perf_hooks_1 = require("perf_hooks");
const untildify = require("untildify");
const globby = require("globby");
const child_process_1 = require("child_process");
const options_1 = require("./options");
/**
 *
 * @param fileOrGlob The file path or glob to use (i.e. /tmp/query.sql or *.sql)
 * @param options
 */
function formatFiles(fileOrGlob, options) {
    let paths = globby.sync(fileOrGlob);
    for (let path of paths) {
        let startTime = perf_hooks_1.performance.now();
        let command = `${buildCommand(options)} ${path}`;
        // Run pgFormatter
        let formatted = child_process_1.execSync(command, {
            encoding: "utf8"
        });
        let endTime = perf_hooks_1.performance.now();
        const elapsedTime = Math.round(endTime - startTime);
        if (options.write) {
            fs.writeFileSync(path, formatted);
            console.log(`${path} ${elapsedTime}ms`);
        }
        else {
            console.log(formatted);
        }
    }
}
exports.default = formatFiles;
/**
 * Format SQL
 * @param sqlText The SQL to be formatted
 * @param options
 */
function formatSql(sqlText, options) {
    let command = buildCommand(options);
    // Pass sqlText in as stdin and run pgFormatter
    let result = child_process_1.execSync(command, {
        encoding: "utf8",
        input: sqlText
    });
}
exports.formatSql = formatSql;
function buildCommand(options) {
    let pgFormatterPath = path.resolve(__dirname, "../vendor/pgFormatter/pg_format");
    let commandArgs = buildCommandArguments(options);
    return `${options.perlBinPath} ${pgFormatterPath} ${commandArgs}`;
}
function buildCommandArguments(options) {
    let commandArgs = "";
    if (options.anonymize) {
        commandArgs += " --anonymize";
    }
    if (options.commaStart) {
        commandArgs += " --comma-start";
    }
    else if (options.commaEnd) {
        commandArgs += " --comma-end";
    }
    if (options.functionCase) {
        let functionCase = options_1.CaseOptionEnum[options.functionCase];
        commandArgs += ` --function-case ${functionCase}`;
    }
    if (options.maxLength) {
        commandArgs += ` --maxlength ${options.maxLength}`;
    }
    if (options.noComment) {
        commandArgs += " --nocomment";
    }
    if (options.placeholder) {
        commandArgs += ` --placeholder ${options.placeholder}`;
    }
    if (options.spaces) {
        commandArgs += ` --spaces ${options.spaces}`;
    }
    if (options.separator) {
        commandArgs += ` --separator \\${options.separator}`;
    }
    if (options.keywordCase) {
        let keywordCase = options_1.CaseOptionEnum[options.keywordCase];
        commandArgs += ` --keyword-case ${keywordCase}`;
    }
    return commandArgs;
}
//# sourceMappingURL=index.js.map