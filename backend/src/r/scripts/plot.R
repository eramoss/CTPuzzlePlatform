# Como salvar plot: https://r-coder.com/save-plot-r/

# install.packages(c("ggplot2","dplyr","optparse"))

library("dplyr") # Pipe %>%
library("ggplot2") # Graphs
library("optparse") # Parse params

plot_avg <- function(){
    ggplot(ToothGrowth, aes(x = supp, y = len)) + geom_boxplot()
    ggplot(ToothGrowth, aes(x = interaction(supp,dose), y = len)) + geom_boxplot()
}

option_list = list(
  # make_option(c("-f", "--file"), type="character", default=NULL, 
  #             help="dataset file name", metavar="character"),
  
  make_option(c("--plot_output_file_path"), type="character", default="plot.png", 
              help="plot_output_file_path plot file name [default= %default]", metavar="character"),
  
  make_option(c("--fn"), type="character", default="avg", 
              help="fn function name [default= %default]", metavar="character")
); 

opt_parser = OptionParser(option_list=option_list);
args = parse_args(opt_parser);

# if (is.null(opt$file)){
#   print_help(opt_parser)
#   stop("At least one argument must be supplied (input file).n", call.=FALSE)
# }

if(is.null(args$plot_output_file_path)){
  print_help(opt_parser)
}

png(args$plot_output_file_path)

if(args$fn == 'avg'){ plot_avg() }

dev.off()