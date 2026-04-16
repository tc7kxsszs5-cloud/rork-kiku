import Foundation

let source = try String(contentsOfFile: "src/App.swift", encoding: .utf8)

if source.contains("LINT_FAIL") {
    FileHandle.standardError.write(Data("lint failed in src/App.swift: found LINT_FAIL marker\n".utf8))
    exit(1)
}

print("lint passed")
