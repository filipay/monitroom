# checks if logs folder exists, if not creates it and the log file
  
# gets the directory of bash script (incase it was run from another dir)  
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/logs"  
LOG_FILE="$DIR/monitroom-info.log" 

if [ ! -d $DIR ]; then
  echo "creating log file..."
  
  echo $LOG_FILE
  mkdir $DIR 
  touch $LOG_FILE

fi
sudo DEBUG=monitroom:* npm start
