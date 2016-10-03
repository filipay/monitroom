# checks if logs folder exists, if not creates it and the log file
  
# gets the directory of bash script (incase it was run from another dir)  
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"  

LOG_FILE="$SCRIPT_DIR/logs/monitroom-info.log" 

if [ ! -d "$SCRIPT_DIR/logs" ]; then
  echo "creating log file..."
  
  echo $LOG_FILE
  mkdir "$SCRIPT_DIR/logs"
  touch $LOG_FILE

fi

cd $SCRIPT_DIR
sudo DEBUG=monitroom:* npm start
