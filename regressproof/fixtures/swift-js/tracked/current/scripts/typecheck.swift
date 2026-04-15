import Foundation

let source = try String(contentsOfFile: "src/App.swift", encoding: .utf8)

if source.contains("TYPE_FAIL") {
    FileHandle.standardError.write(Data("typecheck failed in src/App.swift: found TYPE_FAIL marker\n".utf8))
    exit(1)
}

print("typecheck passed")
