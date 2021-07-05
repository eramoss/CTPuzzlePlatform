install.packages(c("gcookbook", "ggplot2"))
update.packages(ask = FALSE)

install.packages("dplyr")
library(dplyr) # The pipe is provided by dplyr

library(ggplot2)

args <- commandArgs()
print(args)

data <- read.csv('dataset.csv',header=TRUE)

PNG
# PNG device
png(args.plot_file_path)

# Code
plot(rnorm(20))

library(ggplot2)

# Scannter plot
plot(mtcars$wt, mtcars$mpg)

ggplot(mtcars, aes(x = wt, y = mpg)) + geom_point() + stat_smooth(method = lm)

# Line graph

plot(pressure$temperature, pressure$pressure, type="l", col="red")
points(pressure$temperature, pressure$pressure)

ggplot(pressure, aes(x = temperature, y = pressure)) + geom_line() + geom_point()

# Bar graph

barplot(BOD$demand, names.arg = BOD$Time)
barplot(table(mtcars$cyl))

ggplot(BOD, aes(x = Time, y = demand)) + geom_col()
ggplot(mtcars, aes(x = cyl, y = carb)) + geom_col()
ggplot(mtcars, aes(x = factor(cyl), y = carb)) + geom_col()
ggplot(mtcars, aes(x = am, y = carb)) + geom_col()

ggplot(mtcars, aes(x=cyl)) + geom_bar()
ggplot(mtcars, aes(x=factor(cyl))) + geom_bar()


# Histogram
hist(mtcars$mpg)
hist(mtcars$mpg, breaks = 1)
hist(mtcars$mpg, breaks = 2)
hist(mtcars$mpg, breaks = 5)
hist(mtcars$mpg, breaks = 10)
hist(mtcars$mpg, breaks = 100)

ggplot(mtcars, aes(x = mpg)) + geom_histogram()
ggplot(mtcars, aes(x = mpg)) + geom_histogram(binwidth = 25)


# BoxPlot
#[,1]	len	numeric	Tooth length
#[,2]	supp	factor	Supplement type (VC or OJ).
#[,3]	dose	numeric	Dose in milligrams/day

plot(ToothGrowth$supp, ToothGrowth$len, xlab="sup", ylab="len")
boxplot(len ~ supp, ToothGrowth)

ggplot(ToothGrowth, aes(x = supp, y = len)) + geom_boxplot()
ggplot(ToothGrowth, aes(x = interaction(supp,dose), y = len)) + geom_boxplot()

# Exportando ggplot2

ggplot(ToothGrowth, aes(x = interaction(supp,dose), y = len)) + geom_boxplot()

library(ggplot2)
my_gg_plot <- function(data){
  ggplot(data.frame(y=data, x=1:100), aes(y=y, x)) +
    geom_point(aes(x, y), colour="steelblue", size=3) +
    stat_smooth(method="lm", se=FALSE, color="black", lwd=1) + 
    ggtitle("A simple scatterplot") + theme_bw() +
    theme(title = element_text(size=20),
          axis.title.x = element_text(size=18),
          axis.title.y = element_text(size=18),
          axis.text.x  = element_text(size=14),
          axis.text.y  = element_text(size=14))+
    xlab("A random variable plotted") +
    ylab("Some rnorm value")
}

png(filename="ToothGrowth.png", res=120)
ggplot(ToothGrowth, aes(x = interaction(supp,dose), y = len)) + geom_boxplot()
dev.off()

shapiro.test()
