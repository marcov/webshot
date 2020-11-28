#!/bin/bash

set -euo pipefail

declare -r scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
declare -r webshot_tool="js/webshot.js"

[ "$#" -eq 2 ] || { echo -e "ERR: Invalid number of arguments.\n\nUSAGE: `basename $0` CONFIG-FILE DESTINATION-PATH"; exit -1; }
configFile="$1"
destinationPath="$2"

#
# Use phantomjs in path
#
phantomjs_bin="$(command -v phantomjs)"
[ -x "$phantomjs_bin" ] || { echo "ERR: phantomjs tool could not be found"; exit -1; }

cd "${scriptDir}"
node ./js/run-webshot.js "${phantomjs_bin}" "${webshot_tool}" "${configFile}" "${destinationPath}"

exit $?
