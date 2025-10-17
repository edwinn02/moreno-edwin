using System;
class Program
{
    static void Main()
    {
        int n = 0;
        Console.Write("Ingrese el tamaño de la matriz (impar): ");
        n = int.Parse(Console.ReadLine());

        if (n % 2 == 0)
        {
            Console.WriteLine("Ingresar un numero par.\n");
            Console.Write("Ingrese el tamaño de la matriz (impar): ");
            n = int.Parse(Console.ReadLine());
        }

        int[,] matriz = new int[n, n];
        int centro = n / 2;
        Random rand = new Random();
        matriz[centro - 1, centro] = rand.Next(1, 100);
        matriz[centro, centro - 1] = rand.Next(1, 100);
        matriz[centro, centro] = rand.Next(1, 100);
        matriz[centro, centro + 1] = rand.Next(1, 100);
        matriz[centro + 1, centro] = rand.Next(1, 100);
        Console.WriteLine("\nMatriz generada:");
        ImprimirMatriz(matriz, n);
        int producto = Multiplicacion(matriz, n);
        Console.WriteLine($"\nResultado de la multiplicación de los elementos Aleatorios es: \n\n{producto}");
        Console.ReadKey();
    }
    static void ImprimirMatriz(int[,] matriz, int n)
    {
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                Console.Write($"{matriz[i, j],4}");
            }
            Console.WriteLine();
        }
    }
    static int Multiplicacion(int[,] matriz, int n)
    {
        int mul = 1;
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                if (matriz[i, j] != 0)
                {
                    mul *= matriz[i, j];
                }
            }
        }
        return mul;
    }
}