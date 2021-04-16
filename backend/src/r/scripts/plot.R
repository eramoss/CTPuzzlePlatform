# Load LIBS
library("dplyr") # Pipe %>%
library("ggplot2") # Graphs
library("optparse") # Parse PARAMS

# Declare plot functions
plot_boxplot <- function(dataset){
  columnName = names(dataset)[1]
  ggplot(dataset, aes_string(y = columnName)) + geom_boxplot()
}

plot_histogram <- function(dataset){
  columnName = names(dataset)[1]
  ggplot(dataset, aes_string(x = columnName)) + geom_histogram(stat = "count")
}

option_list = list(
  
  make_option(c("--plot_output_file_path"), type="character", default="plot.png", 
              help="plot_output_file_path plot file name [default= %default]", metavar="character"),
  
  make_option(c("--data_input_file_path"), type="character", default="input.csv",
              help="data_input_file_path data to be processed", metavar="character"),

  make_option(c("--fn"), type="character", default="avg", 
              help="fn function name [default= %default]", metavar="character")

);

# Get ARGS
opt_parser = OptionParser(option_list=option_list);
args = parse_args(opt_parser);
print_help(opt_parser)

# Import DATASET
dataset  <- read.csv(args$data_input_file_path, header=TRUE)
summary(dataset)

# Generate GRAPH
png(args$plot_output_file_path, res = 120)
if(args$fn == 'boxplot'){ plot_boxplot(dataset) }
if(args$fn == 'histogram'){ plot_histogram(dataset) }
dev.off()

# Tests
dataset <- read.csv('input.csv', header=TRUE)
plot_histogram(dataset)
plot_boxplot(dataset)

